import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
import { daysUntil } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import MetricCard from '../../components/ui/MetricCard';
import Badge from '../../components/ui/Badge';

const TYPE_STYLES = {
  study:    { bg: 'bg-blue/10 border-blue/30', text: 'text-blue', badge: 'blue' },
  revision: { bg: 'bg-purple/10 border-purple/30', text: 'text-purple', badge: 'purple' },
  practice: { bg: 'bg-accent/10 border-accent/30', text: 'text-accent', badge: 'accent' },
  rest:     { bg: 'bg-surface2 border-border', text: 'text-slate-600', badge: 'ghost' },
};

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Planner = () => {
  const store = useAppStore();
  const { generate, loading } = useAI();

  const daysLeft = daysUntil(store.examDate);
  const planDays = store.planner.length;
  const totalHours = store.planner.reduce((s, d) => s + (d.hours || 0), 0);
  const doneDays = store.planner.filter((d) => d.done).length;

  const handleRegenerate = async () => {
    if (!store.chapter) {
      toast.error('Setup your subject first.');
      return;
    }

    const text = await generate(
`Create a complete study planner.

Details:
- Subject: ${store.subject}
- Chapter: ${store.chapter}
- Exam date: ${store.examDate || 'in 14 days'}
- Study time per day: ${store.hoursPerDay} hours

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No extra text
- JSON must start with [ and end with ]
- "type" MUST be one of: "study", "revision", "practice", "rest"
- "done" MUST be false

FORMAT:
[
  {
    "day": 1,
    "date": "YYYY-MM-DD",
    "topics": ["topic1", "topic2"],
    "hours": 2,
    "focus": "short description",
    "type": "study",
    "done": false
  }
]
`,
      '',
      'planner'
    );

    try {
      console.log("🤖 RAW AI RESPONSE:", text);

      let plan = [];

      try {
        // 🔥 remove markdown if exists
        const cleaned = text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        plan = JSON.parse(cleaned);

      } catch {
        // 🔥 fallback extraction
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');

        if (start !== -1 && end !== -1) {
          const jsonString = text.substring(start, end + 1);
          plan = JSON.parse(jsonString);
        } else {
          throw new Error("No JSON found");
        }
      }

      // 🔥 validation
      const isValid =
        Array.isArray(plan) &&
        plan.length > 0 &&
        plan.every(day =>
          typeof day.day === 'number' &&
          typeof day.date === 'string' &&
          Array.isArray(day.topics) &&
          typeof day.hours === 'number' &&
          typeof day.focus === 'string' &&
          ['study', 'revision', 'practice', 'rest'].includes(day.type) &&
          day.done === false
        );

      if (!isValid) {
        console.error("❌ INVALID PLAN:", plan);
        toast.error('Invalid planner format');
        return;
      }

      store.setPlanner(plan);
      toast.success('Planner generated successfully!');

    } catch (err) {
      console.error("❌ PARSE ERROR:", err);
      toast.error('Could not parse planner');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Study Planner</h1>
        <Button onClick={handleRegenerate} loading={loading} icon={RefreshCw}>
          Generate Plan
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="Days Left" value={daysLeft} icon={Calendar} />
        <MetricCard label="Plan Days" value={planDays} icon={Calendar} />
        <MetricCard label="Total Hours" value={totalHours} icon={Clock} />
        <MetricCard label="Completed" value={doneDays} icon={CheckCircle2} />
      </div>

      {store.planner.length > 0 ? (
        <div className="grid gap-4">
          {store.planner.map((day, i) => {
            const styles = TYPE_STYLES[day.type] || TYPE_STYLES.study;

            return (
              <div
                key={i}
                onClick={() => store.markDayDone(i)}
                className={`p-4 rounded-xl border cursor-pointer ${
                  day.done ? 'bg-green-100' : styles.bg
                }`}
              >
                <h3 className="font-bold">Day {day.day}</h3>
                <p className="text-sm">{day.date}</p>
                <p className="text-sm mt-2">{day.focus}</p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {day.topics.map((t, idx) => (
                    <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs mt-2">{day.hours} hrs</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No planner generated yet</p>
      )}
    </motion.div>
  );
};

export default Planner;
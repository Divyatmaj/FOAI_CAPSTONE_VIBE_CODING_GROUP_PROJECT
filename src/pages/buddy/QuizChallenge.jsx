import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Send, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const QuizChallenge = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');

  // 🔥 FIX: dynamic state instead of static array
  const [challenges, setChallenges] = useState([
    { from: 'Clara Davis', subject: 'Biology Quiz', questions: 10, expires: '2h' },
    { from: 'Frank Miller', subject: 'Math Speed Round', questions: 5, expires: '45m' },
  ]);

  const handleSend = () => {
    if (!to || !subject) {
      toast.error('Fill in all fields.');
      return;
    }

    const newChallenge = {
      from: to,
      subject,
      questions: 5,
      expires: '1h'
    };

    // 🔥 ADD TO STATE
    setChallenges((prev) => [newChallenge, ...prev]);

    toast.success(`Challenge sent to ${to}!`);

    setTo('');
    setSubject('');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">Quiz Challenge</h1>
        <p className="text-gray-400 text-sm mt-1">Challenge your study buddy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="card space-y-4">
          <h2 className="text-sm text-white uppercase flex items-center gap-2">
            <Send size={14} /> Send Challenge
          </h2>

          <input
            className="input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Buddy name"
          />

          <input
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
          />

          <Button fullWidth icon={Zap} onClick={handleSend}>
            Send Challenge
          </Button>
        </div>

        {/* RIGHT SIDE */}
        <div className="card space-y-4">
          <h2 className="text-sm text-white uppercase flex items-center gap-2">
            <Clock size={14} /> Incoming Challenges
          </h2>

          {challenges.map((c, i) => (
            <div key={i} className="p-4 bg-surface2 rounded-xl border flex justify-between">
              <div>
                <p className="text-white text-sm">{c.from}</p>
                <p className="text-gray-400 text-xs">
                  {c.subject} · {c.questions} Qs · {c.expires}
                </p>
              </div>

              <Button size="sm" onClick={() => toast.success('Accepted!')}>
                SENT
              </Button>
            </div>
          ))}

          {!challenges.length && (
            <p className="text-gray-400 text-sm text-center">No challenges yet</p>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default QuizChallenge;
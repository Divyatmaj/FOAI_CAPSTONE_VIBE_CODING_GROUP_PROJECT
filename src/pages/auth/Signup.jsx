import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

import AuthShell from './AuthShell';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/useAuthStore';
import { ROLE_HOME } from '../../routes/ProtectedRoute';
import { signup as signupApi } from '../../services/auth';

const ROLES = [
  { id: 'student', label: 'Student', desc: 'Boost your learning with AI study tools.' },
  { id: 'teacher', label: 'Teacher', desc: 'Track progress and manage classroom analytics.' },
  { id: 'parent', label: 'Parent', desc: 'Monitor learning journey and milestones.' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRoleLocal] = useState('student');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => ROLES.find((r) => r.id === role), [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signupApi({ email, password, role });
      setSession({ token: data.token, user: data.user });
      toast.success('Account created!');
      navigate(ROLE_HOME[data.user.role] || '/student/setup', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Choose your role to get a tailored study experience."
      footer={
        <>
          Already have an account?{' '}
          <Link className="text-accent font-semibold hover:underline" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email Address</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="label">Role</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoleLocal(r.id)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  role === r.id
                    ? 'bg-accent/10 border-accent/30 ring-1 ring-accent/20'
                    : 'bg-surface/70 border-white/70 hover:bg-surface'
                }`}
              >
                <p className={`text-sm font-semibold ${role === r.id ? 'text-accent' : 'text-ink'}`}>{r.label}</p>
                <p className="text-[11px] text-muted mt-1 leading-snug">{r.desc}</p>
              </button>
            ))}
          </div>
          {selected && <p className="text-[11px] text-muted mt-2">Selected: <span className="text-ink font-medium">{selected.label}</span></p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" loading={loading} fullWidth icon={UserPlus} size="lg">
          Sign Up
        </Button>
      </form>
    </AuthShell>
  );
};

export default Signup;


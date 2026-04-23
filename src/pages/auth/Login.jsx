import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import AuthShell from './AuthShell';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/useAuthStore';
import { ROLE_HOME } from '../../routes/ProtectedRoute';
import { login as loginApi } from '../../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      setSession({ token: data.token, user: data.user });
      toast.success('Welcome back!');
      const to = location.state?.from || ROLE_HOME[data.user.role] || '/student/setup';
      navigate(to, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Smart Study Assistant+"
      subtitle="Welcome back. Let’s continue learning."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link className="text-accent font-semibold hover:underline" to="/signup">
            Sign up for free
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
          <div className="flex items-center justify-between">
            <label className="label mb-0">Password</label>
            <span className="text-xs text-muted"> </span>
          </div>
          <div className="relative mt-1.5">
            <input
              className="input pr-10"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

        <Button type="submit" loading={loading} fullWidth icon={LogIn} size="lg">
          Sign In
        </Button>
      </form>
    </AuthShell>
  );
};

export default Login;


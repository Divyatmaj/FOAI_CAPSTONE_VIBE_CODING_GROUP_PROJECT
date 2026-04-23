import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, ChevronRight } from 'lucide-react';
import { NAV, ROLE_CONFIG } from '../../constants/nav';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = ({ onSettings }) => {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();

  // Use the authenticated user's role — no free switching allowed
  const role = user?.role || 'student';
  const nav = NAV[role] || [];
  const rc = ROLE_CONFIG[role];

  // For students, also show buddy nav items
  const buddyNav = role === 'student' ? (NAV.buddy || []) : [];

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-screen bg-surface/70 backdrop-blur-xl border-r border-white/70 fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-gradient text-white shadow-glow flex items-center justify-center text-lg">
            🧠
          </div>
          <div>
            <p className="text-sm font-bold text-ink font-display leading-tight">Smart Study Assistant+</p>
            <p className="text-[10px] text-accent font-semibold tracking-widest uppercase">AI study platform</p>
          </div>
        </div>
      </div>

      {/* Role badge (read-only — no switching) */}
      <div className="px-4 py-4 border-b border-border">
        <p className="label px-2 mb-2">Your Role</p>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30 text-xs font-medium">
          <span>{rc?.emoji}</span> {rc?.label}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-ink hover:bg-surface2/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-accent' : 'text-outline group-hover:text-ink transition-colors'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={13} className="text-accent" />}
              </>
            )}
          </NavLink>
        ))}

        {/* Buddy sub-section for students */}
        {buddyNav.length > 0 && (
          <>
            <div className="pt-4 pb-1 px-2">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">Buddy Mode</p>
            </div>
            {buddyNav.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:text-ink hover:bg-surface2/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={isActive ? 'text-accent' : 'text-outline group-hover:text-ink transition-colors'} />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight size={13} className="text-accent" />}
                  </>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Settings button */}
      <div className="px-4 py-4 border-t border-border">
        {user?.email && (
          <div className="px-3 pb-3">
            <p className="text-xs text-muted">Signed in as</p>
            <p className="text-sm font-medium text-ink truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-ink hover:bg-surface2/70 text-sm font-medium transition-all"
        >
          <Settings size={16} />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-ink hover:bg-surface2/70 text-sm font-medium transition-all"
        >
          <span className="text-base">↩︎</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

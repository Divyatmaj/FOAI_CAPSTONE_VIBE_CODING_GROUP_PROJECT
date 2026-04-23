import React, { useState } from 'react';
import { Settings, Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { NAV, ROLE_CONFIG } from '../../constants/nav';

const Topbar = ({ onSettings }) => {
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Use the authenticated user's role
  const role = user?.role || 'student';
  const rc = ROLE_CONFIG[role];
  const nav = NAV[role] || [];

  // For students, also show buddy nav items in mobile drawer
  const buddyNav = role === 'student' ? (NAV.buddy || []) : [];

  return (
    <>
      <header className="h-16 bg-surface/70 backdrop-blur-xl border-b border-white/70 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
        {/* Mobile: logo + burger */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-surface2/70 text-muted hover:text-ink transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-lg">🧠</span>
            <span className="text-sm font-bold text-ink font-display">Smart Study Assistant+</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface2/70 rounded-xl border border-white/60 backdrop-blur-lg">
            <span className="text-sm">{rc?.emoji}</span>
            <span className="text-xs font-medium text-ink">{rc?.label}</span>
          </div>
          <button
            onClick={onSettings}
            className="p-2 rounded-lg hover:bg-surface2/70 text-muted hover:text-accent transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-ink/15 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <nav className="absolute left-0 top-0 h-full w-[280px] bg-surface/70 backdrop-blur-xl border-r border-white/70 flex flex-col p-4 gap-1">
            <div className="flex items-center gap-2 px-2 py-4 mb-2">
              <span className="text-xl">🧠</span>
              <span className="font-bold font-display text-ink">Smart Study Assistant+</span>
            </div>
            {nav.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink hover:bg-surface2/70'
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}

            {/* Buddy sub-section for students in mobile drawer */}
            {buddyNav.length > 0 && (
              <>
                <div className="pt-4 pb-1 px-2">
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">Buddy Mode</p>
                </div>
                {buddyNav.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink hover:bg-surface2/70'
                      }`
                    }
                  >
                    <Icon size={16} /> {label}
                  </NavLink>
                ))}
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Topbar;

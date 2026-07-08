import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Plane, BookOpen, Users, Wrench,
  BarChart3, ChevronRight, LogOut, Shield, KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/admin' },
  { icon: Plane,           label: 'Flights',     path: '/admin/flights' },
  { icon: BookOpen,        label: 'Bookings',    path: '/admin' },
  { icon: Users,           label: 'Crew',        path: '/admin/crew' },
  { icon: Shield,          label: 'Aircraft',    path: '/admin/aircraft' },
  { icon: Wrench,          label: 'Maintenance', path: '/admin/aircraft' },
  { icon: BarChart3,       label: 'Reports',     path: '/admin' },
];

export function AdminLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1F44] flex flex-col shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
          <div className="w-8 h-8 bg-[#2E8FD8] rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold tracking-wide">AVI<span className="text-[#2E8FD8]">ON</span></span>
          <span className="ml-auto text-xs text-white/40 border border-white/20 rounded px-1.5 py-0.5">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
            return (
              <button key={label} onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-[#2E8FD8] text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#2E8FD8] text-white text-xs flex items-center justify-center shrink-0">
              {user?.initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm text-white truncate">{user?.name}</div>
              <div className="text-xs text-white/40">Administrator</div>
            </div>
          </div>
          <button onClick={() => navigate('/change-password')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all">
            <KeyRound className="w-4 h-4" /> Change Password
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

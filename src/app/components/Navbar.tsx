import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Plane, ChevronDown, LogOut, LayoutDashboard, CalendarDays, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUICK_LOGIN_USERS } from '../data/mockData';

export function Navbar() {
  const { user, login, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isGuest = !user;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDemoLogin = (email: string) => {
    // Demo accounts accept any password in the mock API.
    void login(email, 'demo').then((u) =>
      navigate(u.role === 'admin' ? '/admin' : u.role === 'staff' ? '/staff' : '/dashboard'),
    );
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'staff') return '/staff';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#0A1F44] rounded-xl flex items-center justify-center group-hover:bg-[#2E8FD8] transition-colors">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#0A1F44] tracking-wide">
              AVI<span className="text-[#2E8FD8]">ON</span>
            </span>
          </button>

          {/* Nav links (logged in) */}
          {user && (
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              {user.role === 'passenger' && (
                <>
                  <NavLink label="Dashboard" path="/dashboard" current={location.pathname} />
                  <NavLink label="My Flights" path="/dashboard" current={location.pathname} />
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <NavLink label="Dashboard" path="/admin" current={location.pathname} />
                  <NavLink label="Flights" path="/admin/flights" current={location.pathname} />
                  <NavLink label="Crew" path="/admin/crew" current={location.pathname} />
                  <NavLink label="Aircraft" path="/admin/aircraft" current={location.pathname} />
                </>
              )}
              {user.role === 'staff' && (
                <NavLink label="Staff Portal" path="/staff" current={location.pathname} />
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isGuest ? (
              <>
                {/* Quick demo login */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="hidden sm:flex items-center gap-1 text-sm text-gray-500 hover:text-[#2E8FD8] transition-colors">
                      Demo Login <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content align="end" sideOffset={8}
                      className="bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 min-w-48 z-50">
                      {QUICK_LOGIN_USERS.map(({ label, user: u }) => (
                        <DropdownMenu.Item key={u.id}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#F4F7FB] rounded-lg cursor-pointer outline-none"
                          onSelect={() => handleDemoLogin(u.email)}>
                          <span className="w-6 h-6 rounded-full bg-[#0A1F44] text-white text-xs flex items-center justify-center">{u.initials}</span>
                          {label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
                <button onClick={() => navigate('/auth?mode=signin')}
                  className="text-sm text-[#0A1F44] border border-[#0A1F44] px-4 py-2 rounded-xl hover:bg-[#0A1F44] hover:text-white transition-colors">
                  Sign In
                </button>
                <button onClick={() => navigate('/auth?mode=register')}
                  className="text-sm bg-[#0A1F44] text-white px-4 py-2 rounded-xl hover:bg-[#0d2a5e] transition-colors">
                  Register
                </button>
              </>
            ) : (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full bg-[#0A1F44] text-white text-sm flex items-center justify-center">
                      {user.initials}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-[#0A1F44] leading-none">{user.name.split(' ')[0]}</div>
                      <div className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#0A1F44]" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" sideOffset={8}
                    className="bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 min-w-48 z-50">
                    <div className="px-3 py-2 mb-1 border-b border-gray-100">
                      <div className="text-sm font-medium text-[#0A1F44]">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#F4F7FB] rounded-lg cursor-pointer outline-none"
                      onSelect={() => navigate(getDashboardPath())}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </DropdownMenu.Item>
                    {user.role === 'passenger' && (
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#F4F7FB] rounded-lg cursor-pointer outline-none"
                        onSelect={() => navigate('/dashboard')}>
                        <CalendarDays className="w-4 h-4" /> My Bookings
                      </DropdownMenu.Item>
                    )}
                    {user.role === 'staff' && (
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#F4F7FB] rounded-lg cursor-pointer outline-none"
                        onSelect={() => navigate('/staff/availability')}>
                        <CalendarDays className="w-4 h-4" /> My Availability
                      </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#F4F7FB] rounded-lg cursor-pointer outline-none"
                      onSelect={() => navigate('/change-password')}>
                      <KeyRound className="w-4 h-4" /> Change Password
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none mt-1 border-t border-gray-100"
                      onSelect={handleLogout}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ label, path, current }: { label: string; path: string; current: string }) {
  const navigate = useNavigate();
  const active = current === path;
  return (
    <button onClick={() => navigate(path)}
      className={`text-sm transition-colors ${active ? 'text-[#0A1F44] font-semibold' : 'text-gray-500 hover:text-[#0A1F44]'}`}>
      {label}
    </button>
  );
}

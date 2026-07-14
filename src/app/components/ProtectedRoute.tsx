import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';

/** Where each role lands by default. */
export function homeFor(role: UserRole): string {
  if (role === 'admin') return '/admin';
  if (role === 'staff') return '/staff';
  return '/dashboard';
}

/** The role-specific sign-in routes. */
export const AUTH_PATHS = ['/auth', '/staff/login', '/admin/login'];

/**
 * The sign-in page to send an unauthenticated visitor to, based on the roles a
 * route requires, so they land on the portal that can actually admit them.
 */
export function loginPathFor(roles?: UserRole[]): string {
  if (roles?.includes('admin')) return '/admin/login';
  if (roles?.includes('staff')) return '/staff/login';
  return '/auth?mode=signin';
}

interface Props {
  /** Allowed roles. Omit to allow any authenticated user. */
  roles?: UserRole[];
  children: ReactNode;
}

/**
 * Route guard. Redirects unauthenticated users to the auth page (remembering
 * where they were headed), and users without the required role to their own home.
 */
export function ProtectedRoute({ roles, children }: Props) {
  const { user, isRestoringSession } = useApp();
  const location = useLocation();

  // Wait for the token→user restore to finish before deciding (avoids a
  // flash-redirect to login when refreshing on a protected page).
  if (isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <Loader2 className="w-8 h-8 text-[#2E8FD8] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPathFor(roles)} state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }

  return <>{children}</>;
}

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'brand' | 'influencer';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    // Redirect to sign in
    React.useEffect(() => {
      router.push('/signin');
    }, [router]);

    return null;
  }

  // Check role if specified
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard
    React.useEffect(() => {
      const redirectPath = user.role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard';
      router.push(redirectPath);
    }, [router, user.role]);

    return null;
  }

  // Render protected content
  return <>{children}</>;
}

import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardLayout = () => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full">
        <aside className="hidden md:flex w-64 flex-col border-r p-6 space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2 mt-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar className="hidden md:flex w-64 flex-col shrink-0" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-8 bg-card shrink-0">
          <div>
            <h1 className="text-sm font-medium text-muted-foreground">
              Welcome back, <span className="text-foreground capitalize">{profile?.full_name || 'User'}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-xs font-bold leading-none capitalize">{profile?.role || 'Guest'}</p>
              <p className="text-[10px] text-muted-foreground mt-1 underline">Switch Branch</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

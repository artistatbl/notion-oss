"use client"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/use-user";
import { useUserExists } from "@/hooks/use-user-exists";
import { useParams, useRouter, notFound } from "next/navigation";
import { useEffect } from "react";
import { NotesProvider } from "@/components/notes/notes-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
}



export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useUser();
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { exists: userExists, isLoading: existsLoading } = useUserExists(userId);

  const isLoading = authLoading || existsLoading;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to sign in if not authenticated
      router.push('/sign');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication and user existence
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show 404 if user doesn't exist or if trying to access another user's workspace
  if (userExists === false || (user && user.id !== userId)) {
    notFound();
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <NotesProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </NotesProvider>
  )
}
"use client"

import { useSession } from "@/lib/auth-client"

export function useUser() {
  const { data: session, isPending, error } = useSession()
  
  return {
    user: session?.user || null,
    session,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error
  }
}
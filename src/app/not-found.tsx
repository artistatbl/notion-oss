'use client';

import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function NotFound() {
  const { data: session } = useSession();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 w-full max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">This page couldn't be found</h1>
        <p className="text-sm sm:text-base text-gray-600 mx-auto">
          You may not have access, or it might have been deleted or moved. Check the link and try again.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to my content
        </Link>
      </div>
      
      {session?.user && (
        <div className="fixed bottom-10 left-0 right-0 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 px-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
              <AvatarImage
                src={session.user.image || undefined}
                alt={session.user.name || "User"}
              />
              <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                {getInitials(session.user.name || session.user.email || "U")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[120px] sm:max-w-none">
              Logged in as {session.user.name || session.user.email}
            </span>
          </div>
          <span className="hidden sm:inline">·</span>
          <Link href="#" onClick={() => signOut()} className="hover:text-gray-700">Switch account</Link>
        </div>
      )}
    </div>
  );
}
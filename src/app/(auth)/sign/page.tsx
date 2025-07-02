'use client';

import { useSession } from '@/lib/auth-client';
import { LoginForm } from '@/components/auth/login';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (session?.user) {
  //     // Redirect to user's personal boards page
  //     const userId = session.user.id;
  //     router.push(`/${userId}/boards`);
  //   }
  // }, [session, router]);

  // if (isPending) {
  //   return (
  //     <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col items-center justify-center relative isolate">
  //       <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  //     </main>
  //   );
  // }

  // if (session) {
  //   return null; // Will redirect to user boards
  // }

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col items-center justify-center relative isolate">
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
        <h1 className="inline-flex tracking-tight flex-col gap-1 transition text-center font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-none lg:text-[4rem] bg-gradient-to-r from-20% bg-clip-text text-transparent from-white to-gray-50">
          <span>Sign In to Trello</span>
        </h1>

        <p className="text-[#ececf399] text-lg/7 md:text-xl/8 text-pretty sm:text-wrap sm:text-center text-center mb-8">
          Access your boards and collaborate with your team.
        </p>

        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
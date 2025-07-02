"use client";

import { signIn, signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session, isPending } = useSession();

  // if (isPending) {
  //   return (
  //     <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
  //     </div>
  //   );
  // }

  if (session) {
    return (
      <div className={cn("w-full max-w-md mx-auto  p-6", className)} {...props}>
        <div className="flex flex-col items-center gap-4">
          {session.user.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div className="text-center">
            <p className="text-gray-900 font-semibold text-2xl">Welcome, {session.user.name}!</p>
            <p className="text-gray-600 text-lg">{session.user.email}</p>
          </div>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="w-full text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto  p-6", className)} {...props}>
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Trello</h2>
        <p className="text-gray-600 text-xl">Sign in to continue to your boards</p>
      </div>
      <Button
        onClick={() => signIn.social({ provider: "google" })}
        className="w-full bg-background text-gray-700 hover:bg-gray-50 font-medium py-3"
      >
        <GoogleIcon className="w-6 h-6 mr-3" />
        <span className="text-lg">Continue with Google</span>
      </Button>
      <div className="text-muted-foreground text-center text-sm text-balance mt-4">
        By clicking continue, you agree to our <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{" "}
        and <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
      </div>
    </div>
  )
}
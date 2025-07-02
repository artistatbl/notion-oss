"use client"

import { useState, useEffect } from "react";
import { client } from "@/lib/client";

export function useUserExists(userId: string) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setExists(false);
      setIsLoading(false);
      return;
    }

    const checkUserExists = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await client.users.checkUserExists.$get({ userId });
        const data = await result.json();
        console.log("check if the user does exit" + JSON.stringify(data));
        setExists(data.exists);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserExists();
  }, [userId]);

  return { exists, isLoading, error };
}
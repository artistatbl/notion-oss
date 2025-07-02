import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';

export const usersRouter = j.router({
  // Check if a user exists by ID
  checkUserExists: privateProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      })
    )
    .query(async ({ c, input }) => {
      const { userId } = input;
      
      try {
        const user = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        
        return c.json({ exists: user.length > 0 });
      } catch (error) {
        console.error('Error checking user existence:', error);
        return c.json({ exists: false });
      }
    }),
});
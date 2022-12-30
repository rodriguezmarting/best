import { router } from "../trpc";
import { authRouter } from "./auth";
import { rankRouter } from "./rank";

export const appRouter = router({
  rank: rankRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { router } from "../trpc";
import { rankRouter } from "./rank";

export const appRouter = router({
  rank: rankRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

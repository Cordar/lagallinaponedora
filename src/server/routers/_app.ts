/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc";
import { privateRouter } from "./private";
import { publicRouter } from "./public";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  public: publicRouter,
  private: privateRouter,
});

export type AppRouter = typeof appRouter;

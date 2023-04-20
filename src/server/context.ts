/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions extends Partial<trpcNext.CreateNextContextOptions> {
  // session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts?: CreateContextOptions) {
  return {};
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching
  const contextInner = await createContextInner({});
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

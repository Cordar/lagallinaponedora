import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const publicRouter = createTRPCRouter({
  getProducts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      orderBy: { id: "asc" },
    });
  }),

  getProductWithChoiceGroups: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: { choiceGroups: { include: { choices: true }, orderBy: { id: "asc" } } },
      });

      if (!product) throw new Error("Hubo un error al obtener la personalización del producto.");

      return product;
    }),
});

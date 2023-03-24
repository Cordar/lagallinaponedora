import { OrderStatus } from "@prisma/client";
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

  getOrCreateCustomer: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.customer.upsert({
      where: { sessionId: input.sessionId },
      create: { sessionId: input.sessionId },
      update: {},
      include: { orders: true },
    });
  }),

  getCurrentOrder: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ ctx, input }) => {
    const customer = await ctx.prisma.customer.findUnique({
      where: { sessionId: input.sessionId },
      include: { orders: { include: { customizedProducts: { include: { choices: true } } } } },
    });

    if (!customer) throw new Error("Hubo un error al obtener tu pedido actual.");

    // Get or create order
    let order = customer.orders.find((order) => order.status === OrderStatus.STARTED);
    if (!order) {
      order = await ctx.prisma.order.create({
        data: { customerId: customer.id },
        include: { customizedProducts: { include: { choices: true } } },
      });
    }

    return order;
  }),

  addorRemoveItemToOrder: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
        productId: z.number(),
        choices: z.set(z.number()),
        remove: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find order
      const order = await ctx.prisma.order.findUnique({
        where: { id: input.orderId },
        include: { customizedProducts: { include: { choices: true } } },
      });

      if (!order || order.status !== OrderStatus.STARTED)
        throw new Error(`Hubo un error al ${input.remove ? "quitar" : "añadir"} el producto.`);

      // Check if product exists
      const product = await ctx.prisma.product.findUnique({ where: { id: input.productId } });
      if (!product) throw new Error(`Hubo un error al ${input.remove ? "quitar" : "añadir"} el producto.`);

      // Try to find a CustomizedProduct in the order with exactly the same choices
      const existingCustomizedProduct = order.customizedProducts.find((customizedProduct) => {
        const choices = customizedProduct.choices.map((choice) => choice.id);
        return (
          customizedProduct.productId === product.id &&
          choices.length === input.choices.size &&
          choices.every((choice) => input.choices.has(choice))
        );
      });

      // Remove from order if it exists
      if (existingCustomizedProduct && input.remove) {
        await ctx.prisma.customizedProduct.delete({ where: { id: existingCustomizedProduct.id } });
        return;
      }

      // Increase the amount if it exists
      if (existingCustomizedProduct) {
        await ctx.prisma.customizedProduct.update({
          where: { id: existingCustomizedProduct.id },
          data: { amount: existingCustomizedProduct.amount + 1 },
        });
      }

      // Add to order if it doesn't exist
      else {
        await ctx.prisma.customizedProduct.create({
          data: {
            productId: product.id,
            choices: { connect: [...input.choices].map((choiceId) => ({ id: choiceId })) },
            orders: { connect: { id: order.id } },
          },
        });
      }
    }),
});

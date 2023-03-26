import { OrderStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const publicRouter = createTRPCRouter({
  getProducts: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.product.findMany({
        include: { choiceGroups: true },
        orderBy: { id: "asc" },
      });
    } catch (error) {
      new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener los productos." });
    }
  }),

  getProductWithChoiceGroups: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.prisma.product.findUnique({
          where: { id: input.productId },
          include: { choiceGroups: { include: { choices: true }, orderBy: { id: "asc" } } },
        });

        if (!product) throw new Error();

        return product;
      } catch (error) {
        new TRPCError({ code: "CONFLICT", message: "Hubo un error al obtener la personalización del producto." });
      }
    }),

  getOrCreateCustomer: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.customer.upsert({
        where: { sessionId: input.sessionId },
        create: { sessionId: input.sessionId },
        update: {},
        include: { orders: true },
      });
    } catch (error) {
      new TRPCError({ code: "CONFLICT", message: "Hubo un error al obtener o crear el cliente." });
    }
  }),

  getEstimatedWaitingTime: publicProcedure.input(z.object({ orderId: z.number() })).query(async ({ ctx, input }) => {
    try {
      const [order, paidOrders] = await Promise.all([
        ctx.prisma.order.findUnique({
          where: { id: input.orderId },
          include: { customizedProducts: { include: { Product: true } } },
        }),
        ctx.prisma.order.findMany({
          where: { status: OrderStatus.PAID, NOT: { id: input.orderId } },
          include: { customizedProducts: { include: { Product: true } } },
        }),
      ]);

      if (!order) throw new Error();

      let totalCookingTime = 0;

      order.customizedProducts.forEach((customizedProduct) => {
        totalCookingTime += customizedProduct.Product.cookingTimeInMinutes;
      });

      paidOrders.forEach((paidOrder) => {
        if (paidOrder.updatedAt < order.updatedAt)
          paidOrder.customizedProducts.forEach((customizedProduct) => {
            totalCookingTime += customizedProduct.Product.cookingTimeInMinutes;
          });
      });

      return totalCookingTime;
    } catch (error) {
      new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener el tiempo de espera." });
    }
  }),

  getPaidOrders: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ ctx, input }) => {
    try {
      const customer = await ctx.prisma.customer.findUnique({
        where: { sessionId: input.sessionId },
        include: {
          orders: {
            include: { customizedProducts: { include: { choices: true } } },
            orderBy: { updatedAt: "asc" },
          },
        },
      });
      if (!customer) throw new Error();

      return customer.orders.filter((order) => order.status === OrderStatus.PAID);
    } catch (error) {
      new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener tus pedidos." });
    }
  }),

  getCookedOrders: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ ctx, input }) => {
    try {
      const customer = await ctx.prisma.customer.findUnique({
        where: { sessionId: input.sessionId },
        include: {
          orders: {
            include: { customizedProducts: { include: { choices: true } } },
            orderBy: { updatedAt: "asc" },
          },
        },
      });
      if (!customer) throw new Error();

      return customer.orders.filter((order) => order.status === OrderStatus.COOKED);
    } catch (error) {
      new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener tus pedidos." });
    }
  }),

  updateOrderToPaid: publicProcedure.input(z.object({ orderId: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.order.updateMany({
        where: { id: input.orderId, status: OrderStatus.STARTED },
        data: { status: OrderStatus.PAID },
      });
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Hubo un error al actualizar el pedido.`,
      });
    }
  }),

  updateCustomerInfo: publicProcedure
    .input(z.object({ sessionId: z.string(), name: z.string(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.customer.update({
          where: { sessionId: input.sessionId },
          data: { name: input.name, email: input.email },
        });
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al guardar tu información." });
      }
    }),
});

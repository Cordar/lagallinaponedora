import { OrderStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const publicRouter = createTRPCRouter({
  getProducts: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.product.findMany({
        include: { groups: { include: { subproducts: true } } },
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
          include: { groups: { include: { subproducts: true }, orderBy: { id: "asc" } } },
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
          include: { customizedProducts: { include: { customizedProduct: { include: { Product: true } } } } },
        }),
        ctx.prisma.order.findMany({
          where: { status: OrderStatus.PAID, NOT: { id: input.orderId } },
          include: { customizedProducts: { include: { customizedProduct: { include: { Product: true } } } } },
        }),
      ]);

      if (!order) throw new Error();

      let totalCookingTime = 0;

      order.customizedProducts.forEach((customizedProductOnOrder) => {
        totalCookingTime += customizedProductOnOrder.customizedProduct.Product.cookingTimeInMinutes;
      });

      paidOrders.forEach((paidOrder) => {
        if (paidOrder.updatedAt < order.updatedAt)
          paidOrder.customizedProducts.forEach((customizedProductOnOrder) => {
            totalCookingTime += customizedProductOnOrder.customizedProduct.Product.cookingTimeInMinutes;
          });
      });

      return totalCookingTime;
    } catch (error) {
      new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener el tiempo de espera." });
    }
  }),

  getAreOrdersInProgress: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ ctx, input }) => {
    try {
      const customer = await ctx.prisma.customer.findUnique({
        where: { sessionId: input.sessionId },
        include: { orders: true },
      });
      if (!customer) throw new Error();

      const cookingOrders = customer.orders.some((order) => order.status === OrderStatus.PAID);
      const readyOrders = customer.orders.some((order) => order.status === OrderStatus.COOKED);

      return { cookingOrders, readyOrders };
    } catch (error) {
      new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener tus pedidos." });
    }
  }),

  getPaidOrders: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ ctx, input }) => {
    try {
      const customer = await ctx.prisma.customer.findUnique({
        where: { sessionId: input.sessionId },
        include: {
          orders: {
            include: { customizedProducts: { include: { customizedProduct: { include: { choices: true } } } } },
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
            include: { customizedProducts: { include: { customizedProduct: { include: { choices: true } } } } },
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

  registerOrder: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        customizedProducts: z.array(
          z.object({ amount: z.number().positive(), productId: z.number(), choices: z.array(z.number()) })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const customer = await ctx.prisma.customer.findUnique({ where: { sessionId: input.sessionId } });
        if (!customer) throw new Error();

        // Remove all previous orders with status CREATED
        await ctx.prisma.order.deleteMany({ where: { Customer: { id: customer.id }, status: OrderStatus.CREATED } });

        const customizedProducts = input.customizedProducts.map((customizedProduct) => {
          return {
            customizedProduct: {
              create: {
                amount: customizedProduct.amount,
                Product: { connect: { id: customizedProduct.productId } },
                choices: { connect: customizedProduct.choices.map((choiceId) => ({ id: choiceId })) },
              },
            },
          };
        });

        const order = await ctx.prisma.order.create({
          data: {
            Customer: { connect: { id: customer.id } },
            customizedProducts: { create: customizedProducts },
          },
        });

        return order;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Hubo un error al crear el pedido.`,
        });
      }
    }),

  registerPayment: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const order = await ctx.prisma.order.update({
          where: { id: input.orderId },
          data: { status: OrderStatus.PAID },
        });

        return order;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Hubo un error al registrar el pago.`,
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

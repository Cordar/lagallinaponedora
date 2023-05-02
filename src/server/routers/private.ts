import { OrderStatus, ProductCategory } from "@prisma/client";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/prisma";

export const privateRouter = router({
  getOrdersToCook: publicProcedure.query(async () => {
    try {
      const ordersToCook = await prisma.order.findMany({
        where: { status: OrderStatus.PAID },
        include: {
          orderProduct: {
            include: {
              orderProductOptionGroupOption: {
                include: {
                  option: true,
                },
                orderBy: {
                  optionGroup: {
                    id: "asc",
                  },
                },
              },
              product: true,
            },
          },
        },
        orderBy: { updatedAt: "asc" },
      });

      return ordersToCook;
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Hubo un error al cargar el pedido a cocinar." });
    }
  }),

  getTotalAmountOfDishesToCook: publicProcedure.query(async ({ ctx }) => {
    try {
      const orders = await prisma.order.findMany({
        where: { status: OrderStatus.PAID },
        include: {
          orderProduct: {
            include: { orderProductOptionGroupOption: { include: { option: true } }, product: true },
          },
        },
      });

      const orderProducts = orders.flatMap((order) => order.orderProduct);

      const groupedDishes = orderProducts.reduce((acc, dish) => {
        const dishName = dish.product.name;
        if (acc[dishName]) acc[dishName] += dish.amount;
        else acc[dishName] = dish.amount;

        return acc;
      }, {} as Record<string, number>);

      return groupedDishes;
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Hubo un error al cargar los platos pendientes." });
    }
  }),

  setOrderAsCooked: publicProcedure.input(z.object({ orderId: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await prisma.order.update({
        where: { id: input.orderId },
        data: { status: OrderStatus.COOKED },
      });
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al marcar el pedido como cocinado." });
    }
  }),

  getOrdersToDeliver: publicProcedure.query(async ({ ctx }) => {
    try {
      const ordersToDeliver = await prisma.order.findMany({
        where: { status: OrderStatus.COOKED },
        include: {
          orderProduct: {
            include: { orderProductOptionGroupOption: { include: { option: true } }, product: true },
          },
          customer: true,
        },
        orderBy: { id: "asc" },
      });

      return ordersToDeliver;
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Hubo un error al cargar los pedidos." });
    }
  }),

  setOrderAsDelivered: publicProcedure.input(z.object({ orderId: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await prisma.order.update({
        where: { id: input.orderId },
        data: { status: OrderStatus.DELIVERED },
      });
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al marcar el pedido como entregado." });
    }
  }),
});

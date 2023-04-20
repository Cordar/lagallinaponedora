import { OrderStatus, ProductCategory } from "@prisma/client";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/prisma";

export const privateRouter = router({
  getOrderToCook: publicProcedure.query(async () => {
    try {
      const orderToCook = await prisma.order.findFirst({
        where: { status: OrderStatus.PAID },
        include: {
          chosenProducts: { include: { product: true, chosenSubproducts: { include: { subproduct: true } } } },
        },
        orderBy: { updatedAt: "asc" },
      });

      return orderToCook;
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Hubo un error al cargar el pedido a cocinar." });
    }
  }),

  getTotalAmountOfDishesToCook: publicProcedure.query(async ({ ctx }) => {
    try {
      const orders = await prisma.order.findMany({
        where: { status: OrderStatus.PAID },
        include: {
          chosenProducts: { include: { product: true, chosenSubproducts: { include: { subproduct: true } } } },
        },
      });

      const dishes = orders.flatMap((order) =>
        order.chosenProducts.filter((chosenProduct) => chosenProduct.product.category === ProductCategory.DISH)
      );

      // TODO how do we get the dishes inside the combos?

      const groupedDishes = dishes.reduce((acc, dish) => {
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
          customer: true,
          chosenProducts: { include: { product: true, chosenSubproducts: { include: { subproduct: true } } } },
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

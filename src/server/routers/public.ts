import { OrderStatus } from "@prisma/client";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/prisma";
import { setCookie } from "cookies-next";
import { StorageKey } from "~/utils/constant";

export const apiProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.req || !opts.ctx.res) {
    throw new Error("You are missing `req` or `res` in your call.");
  }
  return opts.next({
    ctx: {
      // We overwrite the context with the truthy `req` & `res`, which will also overwrite the types used in your procedure.
      req: opts.ctx.req,
      res: opts.ctx.res,
    },
  });
});

export const publicRouter = router({
  checkPassword: publicProcedure.input(z.object({ password: z.string() })).query(async ({ input }) => {
    try {
      const password = await prisma.password.findUnique({ where: { password: input.password } });

      if (!password) throw new Error();
      return true;
    } catch (error) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "La contraseña no es correcta.", cause: error });
    }
  }),

  getProductCategories: publicProcedure.query(async () => {
    try {
      return await prisma.productCategory.findMany({
        include: { products: { include: { groups: { include: { subproducts: true } } }, orderBy: { price: "desc" } } },
        orderBy: { id: "asc" },
      });
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Hubo un error al obtener las categorías de productos.",
        cause: error,
      });
    }
  }),

  getProducts: publicProcedure.query(async () => {
    try {
      return await prisma.product.findMany({
        include: { groups: { include: { subproducts: true } } },
        orderBy: { id: "asc" },
      });
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener los productos.", cause: error });
    }
  }),

  getProductById: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: input.productId },
        include: { groups: { include: { subproducts: true }, orderBy: { id: "asc" } } },
      });

      if (!product) throw new Error();

      return product;
    } catch (error) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Hubo un error al obtener la personalización del producto.",
        cause: error,
      });
    }
  }),

  getSubproducts: publicProcedure.query(async () => {
    try {
      const subproducts = await prisma.subproduct.findMany({
        orderBy: { id: "asc" },
      });

      return subproducts;
    } catch (error) {
      throw new TRPCError({ code: "CONFLICT", message: "Hubo un error al obtener la personalización del producto." });
    }
  }),

  getCustomer: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ input }) => {
    try {
      return await prisma.customer.findFirst({
        where: { sessionId: input.sessionId },
        include: { orders: true },
      });
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No se ha encontrado el usuario", cause: error });
    }
  }),

  loginCustomer: apiProcedure
    .input(z.object({ email: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const customer = await prisma.customer.findFirst({
          where: { email: input.email, name: { equals: input.name, mode: "insensitive" } },
          include: { orders: true },
        });

        if (!customer) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email o nombre no encontrado",
          });
        }

        setCookie(StorageKey.SESSION, customer.sessionId, {
          maxAge: 60 * 60 * 24 * 365,
          req: ctx.req,
          res: ctx.res,
        });

        return {
          status: "success",
          customer,
        };
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No se ha encontrado el usuario", cause: error });
      }
    }),

  getEstimatedWaitingTime: publicProcedure.input(z.object({ orderId: z.number() })).query(async ({ input }) => {
    try {
      const [order, paidOrders] = await Promise.all([
        prisma.order.findUnique({
          where: { id: input.orderId },
          include: { chosenProducts: { include: { product: true } } },
        }),
        prisma.order.findMany({
          where: { status: OrderStatus.PAID, NOT: { id: input.orderId } },
          include: { chosenProducts: { include: { product: true } } },
        }),
      ]);

      if (!order) throw new Error();

      let totalCookingTime = 0;

      order.chosenProducts.forEach((chosenProduct: any) => {
        totalCookingTime += chosenProduct.product.cookingTimeInMinutes * chosenProduct.amount;
      });

      paidOrders.forEach((paidOrder: any) => {
        if (paidOrder.updatedAt < order.updatedAt)
          paidOrder.chosenProducts.forEach((chosenProduct: any) => {
            totalCookingTime += chosenProduct.product.cookingTimeInMinutes * chosenProduct.amount;
          });
      });

      return totalCookingTime;
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Hubo un error al obtener el tiempo de espera.",
        cause: error,
      });
    }
  }),

  getAreOrdersInProgress: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ input }) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { sessionId: input.sessionId },
        include: { orders: true },
      });
      if (!customer) return { cookingOrders: false, readyOrders: false };

      const cookingOrders = customer.orders.some((order: any) => order.status === OrderStatus.PAID);
      const readyOrders = customer.orders.some((order: any) => order.status === OrderStatus.COOKED);

      return { cookingOrders, readyOrders };
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener tus pedidos.", cause: error });
    }
  }),

  getPaidOrders: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ input }) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { sessionId: input.sessionId },
        include: {
          orders: {
            include: {
              chosenProducts: { include: { product: true, chosenSubproducts: { include: { subproduct: true } } } },
            },
            orderBy: { updatedAt: "asc" },
          },
        },
      });
      if (!customer) throw new Error();

      return customer.orders.filter((order: any) => order.status === OrderStatus.PAID);
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener tus pedidos.", cause: error });
    }
  }),

  getCookedOrders: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ input }) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { sessionId: input.sessionId },
        include: {
          orders: {
            include: {
              chosenProducts: { include: { product: true, chosenSubproducts: { include: { subproduct: true } } } },
            },
            orderBy: { updatedAt: "asc" },
          },
        },
      });
      if (!customer) throw new Error();

      return customer.orders.filter((order: any) => order.status === OrderStatus.COOKED);
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al obtener tus pedidos.", cause: error });
    }
  }),

  registerOrder: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        chosenProducts: z.array(
          z.object({
            amount: z.number().positive(),
            productId: z.number(),
            chosenSubproducts: z.array(z.number()),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const customer = await prisma.customer.findUnique({ where: { sessionId: input.sessionId } });
        if (!customer) throw new Error();

        // Remove all previous orders with status CREATED
        await prisma.order.deleteMany({ where: { customer: { id: customer.id }, status: OrderStatus.CREATED } });

        const chosenProducts = input.chosenProducts.map(({ amount, productId, chosenSubproducts }) => {
          return {
            amount,
            product: { connect: { id: productId } },
            chosenSubproducts: {
              create: chosenSubproducts.map((subproductId) => ({
                subproduct: { connect: { id: subproductId } },
              })),
            },
          };
        });

        const order = await prisma.order.create({
          data: {
            customer: { connect: { id: customer.id } },
            chosenProducts: { create: chosenProducts },
          },
        });

        return order;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Hubo un error al crear el pedido.`,
          cause: error,
        });
      }
    }),

  registerPayment: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const order = await prisma.order.findUnique({
          where: { id: input.orderId },
        });

        if (!order || order.status !== OrderStatus.CREATED) return;

        const updatedOrder = await prisma.order.update({
          where: { id: input.orderId },
          data: { status: OrderStatus.PAID },
        });

        return updatedOrder;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Hubo un error al registrar el pago.`,
          cause: error,
        });
      }
    }),

  getOrUpsertCustomer: publicProcedure
    .input(z.object({ sessionId: z.string(), name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const customer = await prisma.customer.findFirst({
          where: {
            email: input.email,
          },
        });
        if (customer != null) {
          await prisma.customer.update({
            where: { id: customer.id },
            data: {
              name: input.name,
              sessionId: input.sessionId,
            },
          });
        } else {
          await prisma.customer.create({
            data: {
              email: input.email,
              name: input.name,
              sessionId: input.sessionId,
            },
          });
        }
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al guardar tu información.", cause: error });
      }
    }),
});

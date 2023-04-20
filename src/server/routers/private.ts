import { OrderStatus, ProductCategory } from "@prisma/client";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/prisma";

export const privateRouter = router({
  populateDatabase: publicProcedure.mutation(async ({ ctx }) => {
    await prisma.product.deleteMany();
    await prisma.group.deleteMany();
    await prisma.subproduct.deleteMany();
    await prisma.order.deleteMany();
    await prisma.chosenProduct.deleteMany();
    await prisma.chosenSubproduct.deleteMany();
    await prisma.customer.deleteMany();

    const subproduct_salsas = {
      name: "Elige tu Salsa",
      subproducts: { create: [{ name: "Salsa Roja" }, { name: "Salsa Verde" }, { name: "Salsa Amarilla" }] },
    };

    const subproduct_dishes = {
      name: "Elige tu Plato",
      subproducts: { create: [{ name: "Hamburguesa" }, { name: "Tortilla" }, { name: "Platano" }] },
    };

    const subproduct_drinks = {
      name: "Elige tu bebida",
      subproducts: { create: [{ name: "Agua" }, { name: "Vino" }, { name: "CocaCola" }] },
    };

    const subproduct_dessert = {
      name: "Elige tu postre",
      subproducts: { create: [{ name: "Tarta queso" }, { name: "Flan chocolate" }] },
    };

    await Promise.all([
      prisma.product.create({
        data: {
          name: "Plato + Bebida",
          price: 12,
          category: ProductCategory.COMBO,
          cookingTimeInMinutes: 3,
          groups: {
            create: [subproduct_dishes, subproduct_drinks, subproduct_salsas],
          },
        },
      }),

      prisma.product.create({
        data: {
          name: "Plato + Postre + Bebida",
          price: 15,
          category: ProductCategory.COMBO,
          cookingTimeInMinutes: 4,
          groups: {
            create: [subproduct_dishes, subproduct_drinks, subproduct_salsas, subproduct_dessert],
          },
        },
      }),

      prisma.product.create({
        data: {
          name: "Hamburguesa",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc: "https://media-cdn.tripadvisor.com/media/photo-s/16/5e/62/88/mushie.jpg",
          groups: { create: [subproduct_salsas] },
        },
      }),

      prisma.product.create({
        data: {
          name: "Pizza",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc: "https://img.freepik.com/premium-photo/delicious-pizza-professional-photography_741265-41.jpg",
          groups: { create: [subproduct_salsas] },
        },
      }),

      prisma.product.create({
        data: {
          name: "Tacos",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc:
            "https://thumbs.dreamstime.com/b/mexican-street-tacos-flat-lay-composition-pork-carnitas-avocado-onion-cilantro-red-cabbage-143864544.jpg",
          groups: { create: [subproduct_salsas] },
        },
      }),

      prisma.product.create({
        data: {
          name: "Coca-cola",
          price: 4,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 0,
          imageSrc: "https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2022/08/25/coca-cola.jpeg",
        },
      }),

      prisma.product.create({
        data: {
          name: "Agua",
          price: 2,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 0,
          imageSrc:
            "https://i.guim.co.uk/img/media/eda873838f940582d1210dcf51900efad3fa8c9b/0_469_7360_4417/master/7360.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=4136d0378a9d158831c65d13dcc16389",
        },
      }),

      prisma.product.create({
        data: {
          name: "Cocktail",
          price: 8,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 2,
          imageSrc: "https://i.pinimg.com/550x/42/57/57/425757bec893d00c54b07adbc5100833.jpg",
          groups: {
            create: [
              {
                name: "Lo quieres con alcohol?",
                subproducts: { create: [{ name: "Con Alcohol" }, { name: "Sin Alcohol" }] },
              },
            ],
          },
        },
      }),

      prisma.product.create({
        data: {
          name: "Helado",
          price: 6,
          category: ProductCategory.DESSERT,
          cookingTimeInMinutes: 1,
          imageSrc: "https://cdn.britannica.com/50/80550-050-5D392AC7/Scoops-kinds-ice-cream.jpg",
        },
      }),

      prisma.product.create({
        data: {
          name: "Pastel",
          price: 6,
          category: ProductCategory.DESSERT,
          cookingTimeInMinutes: 1,
          imageSrc: "https://sallysbakingaddiction.com/wp-content/uploads/2013/04/triple-chocolate-cake-4.jpg",
        },
      }),
    ]);
  }),

  getOrderToCook: publicProcedure.query(async ({ ctx }) => {
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

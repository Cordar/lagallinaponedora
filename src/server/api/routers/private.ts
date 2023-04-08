import { OrderStatus, ProductCategory } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const privateRouter = createTRPCRouter({
  populateDatabase: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.product.deleteMany();
    await ctx.prisma.group.deleteMany();
    await ctx.prisma.subproduct.deleteMany();
    await ctx.prisma.order.deleteMany();
    await ctx.prisma.chosenProduct.deleteMany();
    await ctx.prisma.chosenSubproduct.deleteMany();
    await ctx.prisma.customer.deleteMany();

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
      ctx.prisma.product.create({
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

      ctx.prisma.product.create({
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

      ctx.prisma.product.create({
        data: {
          name: "Hamburguesa",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc: "https://media-cdn.tripadvisor.com/media/photo-s/16/5e/62/88/mushie.jpg",
          groups: { create: [subproduct_salsas] },
        },
      }),

      ctx.prisma.product.create({
        data: {
          name: "Pizza",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc: "https://img.freepik.com/premium-photo/delicious-pizza-professional-photography_741265-41.jpg",
          groups: { create: [subproduct_salsas] },
        },
      }),

      ctx.prisma.product.create({
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

      ctx.prisma.product.create({
        data: {
          name: "Coca-cola",
          price: 4,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 0,
          imageSrc: "https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2022/08/25/coca-cola.jpeg",
        },
      }),

      ctx.prisma.product.create({
        data: {
          name: "Agua",
          price: 2,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 0,
          imageSrc:
            "https://i.guim.co.uk/img/media/eda873838f940582d1210dcf51900efad3fa8c9b/0_469_7360_4417/master/7360.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=4136d0378a9d158831c65d13dcc16389",
        },
      }),

      ctx.prisma.product.create({
        data: {
          name: "Cocktail",
          price: 8,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 2,
          imageSrc: "https://i.pinimg.com/550x/42/57/57/425757bec893d00c54b07adbc5100833.jpg",
          groups: {
            create: [{ name: "Lo quieres con alcohol?", subproducts: { create: [{ name: "Sí" }, { name: "No" }] } }],
          },
        },
      }),

      ctx.prisma.product.create({
        data: {
          name: "Helado",
          price: 6,
          category: ProductCategory.DESSERT,
          cookingTimeInMinutes: 1,
          imageSrc: "https://cdn.britannica.com/50/80550-050-5D392AC7/Scoops-kinds-ice-cream.jpg",
        },
      }),

      ctx.prisma.product.create({
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

  getOrdersToDeliver: publicProcedure.query(async ({ ctx }) => {
    try {
      const ordersToDeliver = await ctx.prisma.order.findMany({
        where: { status: OrderStatus.COOKED },
        include: {
          customer: true,
          chosenProducts: { include: { product: true, chosenSubproducts: { include: { subproduct: true } } } },
        },
        orderBy: { updatedAt: "asc" },
      });

      return ordersToDeliver;
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Hubo un error al cargar los pedidos." });
    }
  }),

  setOrderAsDelivered: publicProcedure.input(z.object({ orderId: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: { status: OrderStatus.DELIVERED },
      });
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Hubo un error al marcar el pedido como entregado." });
    }
  }),
});

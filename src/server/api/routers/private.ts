import { ProductCategory } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const privateRouter = createTRPCRouter({
  populateDatabase: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.product.deleteMany();
    await ctx.prisma.choice.deleteMany();
    await ctx.prisma.choiceGroup.deleteMany();
    await ctx.prisma.customizedProduct.deleteMany();
    await ctx.prisma.order.deleteMany();
    await ctx.prisma.customer.deleteMany();

    const dishGroup = await ctx.prisma.choiceGroup.create({ data: { title: "Elige tu plato" } });
    const sauceGroup = await ctx.prisma.choiceGroup.create({ data: { title: "Elige tu salsa" } });
    const drinkGroup = await ctx.prisma.choiceGroup.create({ data: { title: "Elige tu bebida" } });
    const dessertGroup = await ctx.prisma.choiceGroup.create({ data: { title: "Elige tu postre" } });
    const alcoholGroup = await ctx.prisma.choiceGroup.create({ data: { title: "¿Como lo quieres?" } });

    await ctx.prisma.choice.createMany({
      data: [
        { label: "Hamburguesa", choiceGroupId: dishGroup.id },
        { label: "Pizza", choiceGroupId: dishGroup.id },
        { label: "Tacos", choiceGroupId: dishGroup.id },
        { label: "Salsa verde", choiceGroupId: sauceGroup.id },
        { label: "Salsa roja", choiceGroupId: sauceGroup.id },
        { label: "Salsa picante", choiceGroupId: sauceGroup.id },
        { label: "Coca-cola", choiceGroupId: drinkGroup.id },
        { label: "Agua", choiceGroupId: drinkGroup.id },
        { label: "Coctail con alchool", choiceGroupId: drinkGroup.id },
        { label: "Coctail sin alchool", choiceGroupId: drinkGroup.id },
        { label: "Helado", choiceGroupId: dessertGroup.id },
        { label: "Pastel", choiceGroupId: dessertGroup.id },
        { label: "Con alcohol", choiceGroupId: alcoholGroup.id },
        { label: "Sin alcohol", choiceGroupId: alcoholGroup.id },
      ],
    });

    await ctx.prisma.product.create({
      data: {
        name: "Plato + Bebida",
        price: 12,
        category: ProductCategory.COMBO,
        cookingTimeInMinutes: 3,
        choiceGroups: { connect: [{ id: dishGroup.id }, { id: sauceGroup.id }, { id: drinkGroup.id }] },
      },
      include: { choiceGroups: true },
    }),
      await ctx.prisma.product.create({
        data: {
          name: "Plato + Postre + Bebida",
          price: 15,
          category: ProductCategory.COMBO,
          cookingTimeInMinutes: 3,
          choiceGroups: {
            connect: [{ id: dishGroup.id }, { id: sauceGroup.id }, { id: drinkGroup.id }, { id: dessertGroup.id }],
          },
        },
        include: { choiceGroups: true },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Hamburguesa",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc: "https://media-cdn.tripadvisor.com/media/photo-s/16/5e/62/88/mushie.jpg",
          choiceGroups: { connect: [{ id: sauceGroup.id }] },
        },
        include: { choiceGroups: true },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Pizza",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc: "https://img.freepik.com/premium-photo/delicious-pizza-professional-photography_741265-41.jpg",
          choiceGroups: { connect: [{ id: sauceGroup.id }] },
        },
        include: { choiceGroups: true },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Tacos",
          price: 10,
          category: ProductCategory.DISH,
          cookingTimeInMinutes: 3,
          imageSrc:
            "https://thumbs.dreamstime.com/b/mexican-street-tacos-flat-lay-composition-pork-carnitas-avocado-onion-cilantro-red-cabbage-143864544.jpg",
          choiceGroups: { connect: [{ id: sauceGroup.id }] },
        },
        include: { choiceGroups: true },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Coca-cola",
          price: 4,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 0,
          imageSrc: "https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2022/08/25/coca-cola.jpeg",
        },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Agua",
          price: 2,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 0,
          imageSrc:
            "https://i.guim.co.uk/img/media/eda873838f940582d1210dcf51900efad3fa8c9b/0_469_7360_4417/master/7360.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=4136d0378a9d158831c65d13dcc16389",
        },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Coctail",
          price: 8,
          category: ProductCategory.DRINK,
          cookingTimeInMinutes: 2,
          imageSrc: "https://i.pinimg.com/550x/42/57/57/425757bec893d00c54b07adbc5100833.jpg",
          choiceGroups: { connect: [{ id: alcoholGroup.id }] },
        },
        include: { choiceGroups: true },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Helado",
          price: 6,
          category: ProductCategory.DESSERT,
          cookingTimeInMinutes: 1,
          imageSrc: "https://cdn.britannica.com/50/80550-050-5D392AC7/Scoops-kinds-ice-cream.jpg",
        },
      }),
      await ctx.prisma.product.create({
        data: {
          name: "Pastel",
          price: 6,
          category: ProductCategory.DESSERT,
          cookingTimeInMinutes: 1,
          imageSrc: "https://sallysbakingaddiction.com/wp-content/uploads/2013/04/triple-chocolate-cake-4.jpg",
        },
      });
  }),
});

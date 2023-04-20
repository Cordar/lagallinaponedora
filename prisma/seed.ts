import { PrismaClient, ProductCategory } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  /**
   * Product Category
   */
  const pc_special_offers = await prisma.productCategory.create({
    data: {
      name: "Ofertas Especiales",
      order: 0,
    },
  });
  const pc_dishes = await prisma.productCategory.create({
    data: {
      name: "Platos",
      order: 1,
    },
  });
  const pc_snacks = await prisma.productCategory.create({
    data: {
      name: "Para Picar",
      order: 2,
    },
  });
  const pc_drinks = await prisma.productCategory.create({
    data: {
      name: "Bebidas",
      order: 3,
    },
  });
  const pc_bottles = await prisma.productCategory.create({
    data: {
      name: "Botellas 70cl.",
      order: 4,
    },
  });
  const pc_dessert = await prisma.productCategory.create({
    data: {
      name: "Postres",
      order: 5,
    },
  });
  const pc_cocktails = await prisma.productCategory.create({
    data: {
      name: "Cocktails con Ron Barceló Organic",
      order: 6,
    },
  });

  /**
   * SubProducts
   */
  const subproduct_protein = {
    name: "Escoge Proteína",
    subproducts: { create: [{ name: "Ternera" }, { name: "Pollo" }, { name: "Tofu" }] },
  };

  const subproduct_carbohydrate = {
    name: "Escoge Hidrato",
    subproducts: { create: [{ name: "Pan" }, { name: "Pasta" }, { name: "Arroz" }] },
  };

  const subproduct_salsas = {
    name: "Escoge Salsa",
    subproducts: { create: [{ name: "Manzana-Jengibre" }, { name: "Curry" }, { name: "Ras El Hanout" }] },
  };

  const subproduct_drinks = {
    name: "Escoge Bebida",
    subproducts: { create: [{ name: "Agua Mineral" }, { name: "Limonada" }, { name: "San Miguel Eco" }] },
  };

  const subproduct_dessert = {
    name: "Escoge Postre",
    subproducts: { create: [{ name: "Fruta Fresca Variada" }, { name: "Arroz Con Leche" }] },
  };

  /**
   * Products
   */
  interface CreateProduct {
    name: string;
    price: number;
    category: ProductCategory;
    cookingTimeInMinutes?: number;
    imageSrc?: string;
    groups?: Array<any>;
  }
  async function createProduct(product: CreateProduct) {
    let { name, price, category, cookingTimeInMinutes, imageSrc, groups } = product;
    if (!cookingTimeInMinutes) {
      cookingTimeInMinutes = 0;
    }
    if (!imageSrc) {
      imageSrc = "";
    }
    if (!groups) {
      groups = [];
    }
    await prisma.product.create({
      data: {
        name: name,
        price: price,
        category: { connect: { id: category.id } },
        cookingTimeInMinutes: cookingTimeInMinutes,
        imageSrc: imageSrc,
        groups: {
          create: groups,
        },
      },
    });
  }

  createProduct({
    name: "Menú BIO Completo (Plato + Bebida + Postre)",
    price: 15,
    category: pc_special_offers,
    groups: [subproduct_protein, subproduct_carbohydrate, subproduct_salsas, subproduct_drinks, subproduct_dessert],
  });

  createProduct({
    name: "Menú BIO (Plato + Bebida)",
    price: 12,
    category: pc_special_offers,
    groups: [subproduct_protein, subproduct_carbohydrate, subproduct_salsas, subproduct_drinks],
  });

  createProduct({
    name: "Ternera",
    price: 10,
    category: pc_dishes,
    groups: [subproduct_carbohydrate, subproduct_salsas],
  });

  createProduct({
    name: "Pollo",
    price: 10,
    category: pc_dishes,
    groups: [subproduct_carbohydrate, subproduct_salsas],
  });

  createProduct({
    name: "Tofu",
    price: 10,
    category: pc_dishes,
    groups: [subproduct_carbohydrate, subproduct_salsas],
  });

  createProduct({
    name: "Gazpacho",
    price: 5,
    category: pc_snacks,
    imageSrc: "https://www.annarecetasfaciles.com/files/gazpacho-andaluz.jpg",
  });

  createProduct({
    name: "Patatas Grill",
    price: 5,
    category: pc_snacks,
    imageSrc: "https://alkarbonurbangrill.com/wp-content/uploads/2022/01/patatas-asadas.jpg",
  });

  createProduct({
    name: "Snacks de Verdura",
    price: 5,
    category: pc_snacks,
    imageSrc: "https://www.cocinacaserayfacil.net/wp-content/uploads/2020/08/Verduras-al-horno.jpg",
  });

  createProduct({
    name: "Agua Mineral",
    price: 3,
    category: pc_drinks,
  });

  createProduct({
    name: "Limonada",
    price: 3,
    category: pc_drinks,
  });

  createProduct({
    name: "San Miguel Eco",
    price: 3,
    category: pc_drinks,
  });

  createProduct({
    name: "Vino Blanco",
    price: 12,
    category: pc_bottles,
  });

  createProduct({
    name: "Vino Tinto",
    price: 12,
    category: pc_bottles,
  });

  createProduct({
    name: "Cava",
    price: 15,
    category: pc_bottles,
  });

  createProduct({
    name: "Fruta Fresca Variada",
    price: 5,
    category: pc_dessert,
  });

  createProduct({
    name: "Arroz con Leche",
    price: 5,
    category: pc_dessert,
  });

  createProduct({
    name: "Mojito",
    price: 8,
    category: pc_cocktails,
  });

  createProduct({
    name: "Mojito con Cerveza",
    price: 8,
    category: pc_cocktails,
  });

  createProduct({
    name: "Piña Colada",
    price: 8,
    category: pc_cocktails,
  });

  createProduct({
    name: "Daiquiri de Fresa",
    price: 8,
    category: pc_cocktails,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

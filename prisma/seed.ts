import { OptionGroup, PrismaClient, Product, ProductCategory } from "@prisma/client";
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
  const pc_eat = await prisma.productCategory.create({
    data: {
      name: "Para Comer",
      order: 1,
    },
  });
  const pc_drink = await prisma.productCategory.create({
    data: {
      name: "Para Beber",
      order: 2,
    },
  });

  /**
   * OptionGroups
   */
  async function createOptionGroup(name: string, title: string) {
    return await prisma.optionGroup.create({
      data: {
        name: name,
        title: title,
      },
    });
  }
  const og_protein = await createOptionGroup("Proteína", "Escoge proteína");
  const og_base = await createOptionGroup("Base", "Escoge base");
  const og_sauce = await createOptionGroup("Salsa", "Escoge salsa");
  const og_picar = await createOptionGroup("Picar", "Escoge");
  const og_aperitivo = await createOptionGroup("Aperitivo", "Escoge");
  const og_postre = await createOptionGroup("Postre", "Escoge");
  const og_bebida = await createOptionGroup("Bebida", "Escoge");
  const og_botella = await createOptionGroup("Botella", "Escoge");
  const og_cocktail = await createOptionGroup("Cocktail", "Escoge");

  /**
   * Options
   */
  interface CreateOption {
    name: string;
    internalName: string;
    stock: number;
    extraPrice?: number;
    group: OptionGroup;
  }

  async function createOption(option: CreateOption) {
    let { name, internalName, stock, extraPrice, group } = option;
    if (!extraPrice) {
      extraPrice = 0;
    }
    await prisma.option.create({
      data: {
        name: name,
        internalName: internalName,
        price: extraPrice,
        stock: stock,
        group: { connect: { id: group.id } },
      },
    });
  }

  createOption({ group: og_protein, name: "ternera", internalName: "TERNERA", stock: 100 });
  createOption({ group: og_protein, name: "pollo", internalName: "POLLO", stock: 100 });
  createOption({ group: og_protein, name: "tofu", internalName: "TOFU", stock: 100 });
  createOption({ group: og_protein, name: "extra_verdura", internalName: "MAS VERDU", stock: 100 });
  createOption({ group: og_base, name: "pan", internalName: "PAN", stock: 200 });
  createOption({ group: og_base, name: "pasta", internalName: "PASTA", stock: 200 });
  createOption({ group: og_base, name: "arroz", internalName: "ARROZ", stock: 200 });
  createOption({ group: og_base, name: "sin_base", internalName: "SIN BASE", stock: -1 });
  createOption({ group: og_sauce, name: "manzana_jengibre", internalName: "MANZA", stock: 100 });
  createOption({ group: og_sauce, name: "curry", internalName: "CURRY", stock: 100 });
  createOption({ group: og_sauce, name: "ras_el_hanout", internalName: "RASEL", stock: 100 });
  createOption({ group: og_sauce, name: "sin_salsa", internalName: "SIN SALSA", stock: 100 });
  createOption({ group: og_picar, name: "patatas_grill", internalName: "PATATA GRILL", stock: 100 });
  createOption({ group: og_picar, name: "snacks_verdura", internalName: "VERDURA GRILL", stock: 100 });
  createOption({ group: og_aperitivo, name: "gazpacho", internalName: "GAZPACHO", stock: 100 });
  createOption({ group: og_postre, name: "fruta_cortada", internalName: "FRUTA CORTADA", stock: 100 });
  createOption({ group: og_postre, name: "arroz_con_leche", internalName: "ARROZ LECHE", stock: 100 });
  createOption({ group: og_bebida, name: "agua_mineral", internalName: "AGUA", stock: 200 });
  createOption({ group: og_bebida, name: "limonada", internalName: "LIMONADA", stock: 200 });
  createOption({
    group: og_bebida,
    name: "san_miguel_eco",
    internalName: "SAN MIGUEL ECO",
    stock: 200,
  });
  createOption({ group: og_botella, name: "vino_blanco", internalName: "VINO BLANCO", stock: 6 });
  createOption({ group: og_botella, name: "vino_tinto", internalName: "VINO TINTO", stock: 8 });
  createOption({ group: og_botella, name: "cava", internalName: "CAVA", stock: 9, extraPrice: 3 });
  createOption({ group: og_cocktail, name: "mojito", internalName: "CAVA", stock: 10 });
  createOption({ group: og_cocktail, name: "mojito_cerveza", internalName: "MOJITO CERVEZA", stock: 10 });
  createOption({ group: og_cocktail, name: "pina_colada", internalName: "PIÑA COLADA", stock: 10 });
  createOption({ group: og_cocktail, name: "daiquiri_de_fresa", internalName: "DAIQUIRI FRESA", stock: 10 });

  /**
   * Products
   */
  interface CreateProduct {
    name: string;
    internalName: string;
    price: number;
    category: ProductCategory;
    order: number;
    cookingTimeInMinutes?: number;
    imageSrc?: string;
  }
  async function createProduct(product: CreateProduct) {
    let { name, internalName, price, category, order, cookingTimeInMinutes, imageSrc } = product;
    if (!cookingTimeInMinutes) {
      cookingTimeInMinutes = 0;
    }
    if (!imageSrc) {
      imageSrc = "";
    }
    return await prisma.product.create({
      data: {
        name: name,
        internalName: internalName,
        price: price,
        category: { connect: { id: category.id } },
        cookingTimeInMinutes: cookingTimeInMinutes,
        order: order,
        imageSrc: imageSrc,
      },
    });
  }

  const p_mco = await createProduct({
    name: "menu_completo",
    internalName: "MCO",
    order: 1,
    price: 15.0,
    cookingTimeInMinutes: 0,
    category: pc_special_offers,
  });

  const p_men = await createProduct({
    name: "menu",
    internalName: "MEN",
    order: 2,
    price: 12.0,
    cookingTimeInMinutes: 0,
    category: pc_special_offers,
  });

  const p_pla = await createProduct({
    name: "plato",
    internalName: "PLA",
    order: 3,
    price: 10.0,
    cookingTimeInMinutes: 0,
    category: pc_eat,
  });

  const p_pic = await createProduct({
    name: "picar",
    internalName: "PIC",
    order: 4,
    price: 5.0,
    cookingTimeInMinutes: 0,
    category: pc_eat,
  });

  const p_ape = await createProduct({
    name: "aperitivo",
    internalName: "APE",
    order: 5,
    price: 5.0,
    cookingTimeInMinutes: 0,
    category: pc_eat,
  });

  const p_pos = await createProduct({
    name: "postre",
    internalName: "POS",
    order: 6,
    price: 5.0,
    cookingTimeInMinutes: 0,
    category: pc_eat,
  });

  const p_beb = await createProduct({
    name: "bebida",
    internalName: "BEB",
    order: 7,
    price: 3.0,
    cookingTimeInMinutes: 0,
    category: pc_drink,
  });

  const p_bot = await createProduct({
    name: "botella",
    internalName: "BOT",
    order: 8,
    price: 12.0,
    cookingTimeInMinutes: 0,
    category: pc_drink,
  });

  const p_cok = await createProduct({
    name: "cocktail",
    internalName: "COK",
    order: 9,
    price: 8.0,
    cookingTimeInMinutes: 0,
    category: pc_drink,
  });

  /**
   * Connecting
   */
  interface CreateProductOptionGroup {
    product: Product;
    optionGroup: OptionGroup;
  }
  async function createProductOptionGroup(productOptionGroup: CreateProductOptionGroup) {
    await prisma.productOptionGroup.create({
      data: {
        product: { connect: { id: productOptionGroup.product.id } },
        optionGroup: { connect: { id: productOptionGroup.optionGroup.id } },
      },
    });
  }

  createProductOptionGroup({ product: p_pla, optionGroup: og_base });
  createProductOptionGroup({ product: p_pla, optionGroup: og_protein });
  createProductOptionGroup({ product: p_pla, optionGroup: og_sauce });
  createProductOptionGroup({ product: p_pic, optionGroup: og_picar });
  createProductOptionGroup({ product: p_ape, optionGroup: og_aperitivo });
  createProductOptionGroup({ product: p_pos, optionGroup: og_postre });
  createProductOptionGroup({ product: p_beb, optionGroup: og_bebida });
  createProductOptionGroup({ product: p_bot, optionGroup: og_botella });
  createProductOptionGroup({ product: p_cok, optionGroup: og_cocktail });

  interface CreateProductComponent {
    parent: Product;
    child: Product;
  }
  async function createProductComponent(productComponent: CreateProductComponent) {
    await prisma.productComponent.create({
      data: {
        parent: { connect: { id: productComponent.parent.id } },
        child: { connect: { id: productComponent.child.id } },
      },
    });
  }

  createProductComponent({ parent: p_mco, child: p_pla });
  createProductComponent({ parent: p_mco, child: p_beb });
  createProductComponent({ parent: p_mco, child: p_pos });
  createProductComponent({ parent: p_men, child: p_pla });
  createProductComponent({ parent: p_men, child: p_beb });

  /**
   * Globals
   */
  interface CreateGlobal {
    key: string;
    value: string;
  }
  async function createGlobal(global: CreateGlobal) {
    await prisma.globals.create({
      data: {
        key: global.key,
        value: global.value,
      },
    });
  }

  createGlobal({ key: "admin_password", value: "gallina" });
  createGlobal({ key: "hidden_order_password", value: "bioc2023" });
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

import type { Choice, CustomizedProduct, CustomizedProductsOnOrders, Order } from "@prisma/client";

export type OrderWithCustomizedProducts = Order & {
  customizedProducts: (CustomizedProductsOnOrders & {
    customizedProduct: CustomizedProduct & {
      choices: Choice[];
    };
  })[];
};

import type { ChosenProduct, ChosenSubproduct, Order } from "@prisma/client";

export type OrderWithChosenProducts = Order & {
  chosenProducts: (ChosenProduct & {
    product: Product;
    chosenSubproducts: (ChosenSubproduct & {
      subproduct: Subproduct;
    })[];
  })[];
};

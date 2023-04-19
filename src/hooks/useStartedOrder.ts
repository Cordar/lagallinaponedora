import type { ChosenProduct, ChosenSubproduct } from "@prisma/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { StorageKey } from "~/utils/constant";
import { getFromStorage, setToStorage } from "~/utils/storage";

const storageSchema = z.array(
  z.object({
    id: z.number(),
    amount: z.number(),
    productId: z.number(),
    orderId: z.number().nullable(),

    chosenSubproduct: z.array(
      z.object({
        id: z.number(),
        chosenProductId: z.number(),
        subproductId: z.number(),
      })
    ),
  })
);

export type ChosenProductWithSubproducts = ChosenProduct & { chosenSubproduct: ChosenSubproduct[] };

const useStartedOrder = () => {
  const [startedOrder, setStartedOrder] = useState<ChosenProductWithSubproducts[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const startedOrder = getFromStorage(StorageKey.STARTED_ORDER);

    let parsedData: ChosenProductWithSubproducts[] = [];
    try {
      parsedData = storageSchema.parse(startedOrder);
    } catch (error) {
    } finally {
      setStartedOrder(parsedData);
      setToStorage(StorageKey.STARTED_ORDER, parsedData);
    }
  }, []);

  const addProduct = (product: ChosenProductWithSubproducts) => {
    const newStartedOrder = mergeDuplicates([...startedOrder, product]);

    setStartedOrder(newStartedOrder);
    setToStorage(StorageKey.STARTED_ORDER, newStartedOrder);
  };

  const removeProduct = (idToRemove: number) => {
    const productToRemove = startedOrder.find(({ id }) => id === idToRemove);
    if (!productToRemove) return;

    const newStartedOrder =
      productToRemove.amount > 1
        ? startedOrder.map((product) => {
            if (product.id === idToRemove) return { ...product, amount: product.amount - 1 };
            return product;
          })
        : startedOrder.filter(({ id }) => id !== idToRemove);

    setStartedOrder(newStartedOrder);
    setToStorage(StorageKey.STARTED_ORDER, newStartedOrder);
  };

  const mergeDuplicates = (products: ChosenProductWithSubproducts[]) => {
    const mergedProducts: ChosenProductWithSubproducts[] = [];

    products.forEach((product) => {
      const existingProduct = mergedProducts.find(({ productId, chosenSubproduct: chosenSubproducts }) => {
        return (
          product.productId === productId &&
          product.chosenSubproduct.length === chosenSubproducts.length &&
          product.chosenSubproduct.every(({ subproductId }) =>
            chosenSubproducts.some(({ subproductId: chosenSubproductId }) => chosenSubproductId === subproductId)
          )
        );
      });

      if (existingProduct) existingProduct.amount += product.amount;
      else mergedProducts.push(product);
    });

    return mergedProducts;
  };

  const clearStartedOrder = () => {
    setStartedOrder([]);
    setToStorage(StorageKey.STARTED_ORDER, []);
  };

  return { startedOrder, addProduct, removeProduct, clearStartedOrder };
};

export default useStartedOrder;

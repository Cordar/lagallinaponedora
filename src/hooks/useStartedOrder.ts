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

    chosenSubproducts: z.array(
      z.object({
        id: z.number(),
        chosenProductId: z.number(),
        subproductId: z.number(),
      })
    ),
  })
);

export type ChosenProductWithSubproducts = ChosenProduct & { chosenSubproducts: ChosenSubproduct[] };

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
    const newStartedOrder = [...startedOrder, product];

    setStartedOrder(newStartedOrder);
    setToStorage(StorageKey.STARTED_ORDER, newStartedOrder);
  };

  const removeProduct = (idToRemove: number) => {
    const newStartedOrder = startedOrder.filter(({ id }) => id !== idToRemove);

    setStartedOrder(newStartedOrder);
    setToStorage(StorageKey.STARTED_ORDER, newStartedOrder);
  };

  const clearStartedOrder = () => {
    setStartedOrder([]);
    setToStorage(StorageKey.STARTED_ORDER, []);
  };

  return { startedOrder, addProduct, removeProduct, clearStartedOrder };
};

export default useStartedOrder;

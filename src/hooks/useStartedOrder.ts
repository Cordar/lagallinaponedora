import type { ChosenProduct, ChosenSubproduct } from "@prisma/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { StorageKey } from "~/utils/constant";
import getRandomNumberId from "~/utils/getRandomNumberId";
import { getFromStorage, setToStorage } from "~/utils/storage";


const storageSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    productId: z.number(),
    orderId: z.number().optional(),
    amount: z.number(),
    chosenSubproducts: z.array(
      z.object({
        name: z.string(),
        chosenProductId: z.number(),
        subproductId: z.number(),
      })
    ),
  })
)

interface ChosenSubproductStorage {
  name: string,
  chosenProductId: number,
  subproductId: number,
}

export interface CreateChosenProductStorage {
  name: string,
  productId: number,
  orderId?: number,
  amount: number,
  chosenSubproducts: ChosenSubproductStorage[]
}

export interface ChosenProductStorage extends CreateChosenProductStorage {
  id: number,
}

const useStartedOrder = () => {
  const [startedOrder, setStartedOrder] = useState<ChosenProductStorage[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const startedOrder = getFromStorage(StorageKey.STARTED_ORDER);

    let parsedData: ChosenProductStorage[] = [];
    try {
      parsedData = storageSchema.parse(startedOrder);
    } catch (error) {
    } finally {
      setStartedOrder(parsedData);
      setToStorage(StorageKey.STARTED_ORDER, parsedData);
    }
  }, []);

  const addProduct = (product: CreateChosenProductStorage) => {
    const newId = getRandomNumberId()
    const chosenProductStorage: ChosenProductStorage = { ...product, id: newId }

    const newStartedOrder = [...startedOrder, chosenProductStorage];

    setStartedOrder(newStartedOrder);
    setToStorage(StorageKey.STARTED_ORDER, newStartedOrder);
  };

  const removeProduct = (idToRemove: number) => {
    const newStartedOrder = startedOrder.filter(({ id }) => id !== idToRemove)

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

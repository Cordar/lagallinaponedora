import { type Choice, type CustomizedProduct } from "@prisma/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { StorageKey } from "~/utils/constant";
import { getFromStorage, setToStorage } from "~/utils/storage";

const storageSchema = z.array(
  z.object({
    id: z.number(),
    productId: z.number(),
    amount: z.number(),
    choices: z.array(
      z.object({
        id: z.number(),
        label: z.string(),
        choiceGroupId: z.number(),
      })
    ),
  })
);

const useStartedOrder = () => {
  const [startedOrder, setStartedOrder] = useState<(CustomizedProduct & { choices: Choice[] })[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const startedOrder = getFromStorage(StorageKey.STARTED_ORDER);

    let parsedData: (CustomizedProduct & { choices: Choice[] })[] = [];
    try {
      parsedData = storageSchema.parse(startedOrder) as (CustomizedProduct & { choices: Choice[] })[];
    } catch (error) {
    } finally {
      setStartedOrder(parsedData);
      setToStorage(StorageKey.STARTED_ORDER, parsedData);
    }
  }, []);

  const addProduct = (product: CustomizedProduct & { choices: Choice[] }) => {
    const newStartedOrder = [...startedOrder, product];

    const newStartedOrderWithoutDuplicates = removeDuplicates(newStartedOrder);

    setStartedOrder(newStartedOrderWithoutDuplicates);
    setToStorage(StorageKey.STARTED_ORDER, newStartedOrderWithoutDuplicates);
  };

  const removeProduct = (product: CustomizedProduct & { choices: Choice[] }) => {
    const newStartedOrderWithoutDuplicates = removeDuplicates(startedOrder);

    const result = newStartedOrderWithoutDuplicates.filter((p) => {
      if (p.productId !== product.productId) return true;
      if (p.choices.length !== product.choices.length) return true;

      const choicesMatch = p.choices.every((choice) => {
        return product.choices.some((inputChoice) => inputChoice.id === choice.id);
      });
      if (!choicesMatch) return true;

      if (p.amount > 1) {
        p.amount -= 1;
        return true;
      }

      return false;
    });

    setStartedOrder(result);
    setToStorage(StorageKey.STARTED_ORDER, result);
  };

  const removeDuplicates = (array: (CustomizedProduct & { choices: Choice[] })[]) => {
    return array.reduce((acc, product) => {
      const productIndex = acc.findIndex((p) => p.productId === product.productId);

      if (productIndex === -1) acc.push(product);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      else acc[productIndex]!.amount += product.amount;

      return acc;
    }, [] as (CustomizedProduct & { choices: Choice[] })[]);
  };

  return { startedOrder, addProduct, removeProduct };
};

export default useStartedOrder;

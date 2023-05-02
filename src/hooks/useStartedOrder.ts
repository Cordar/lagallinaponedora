import { useEffect, useState } from "react";
import { z } from "zod";
import { StorageKey } from "~/utils/constant";
import { getFromStorage, setToStorage } from "~/utils/storage";

const startedOrderSchema = z.object({
  id: z.number(),
  productId: z.number(),
  amount: z.number(),

  options: z.array(
    z.object({
      id: z.number(),
      optionGroupId: z.number(),
      optionId: z.number(),
    })
  ),
});

const storageSchema = z.array(startedOrderSchema);

export type StartedOrder = z.infer<typeof startedOrderSchema>;

const useStartedOrder = () => {
  const [startedOrder, setStartedOrder] = useState<StartedOrder[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const startedOrder = getFromStorage(StorageKey.STARTED_ORDER);

    let parsedData: StartedOrder[] = [];
    try {
      parsedData = storageSchema.parse(startedOrder);
    } catch (error) {
    } finally {
      setStartedOrder(parsedData);
      setToStorage(StorageKey.STARTED_ORDER, parsedData);
    }
  }, []);

  const addProduct = (product: StartedOrder) => {
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

  const mergeDuplicates = (storageOrder: StartedOrder[]) => {
    const mergedProducts: StartedOrder[] = [];

    storageOrder.forEach((orderProduct) => {
      const existingProduct = mergedProducts.find(({ productId, options: orderProductOptionGroupOptions }) => {
        return (
          orderProduct.productId === productId &&
          orderProduct.options.length === orderProductOptionGroupOptions.length &&
          orderProduct.options.every(({ optionGroupId: orderOptionGroupId, optionId: orderOptionId }) =>
            orderProductOptionGroupOptions.some(
              ({ optionGroupId, optionId }) => optionGroupId === orderOptionGroupId && orderOptionId === optionId
            )
          )
        );
      });

      if (existingProduct) existingProduct.amount += orderProduct.amount;
      else mergedProducts.push(orderProduct);
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

import { api } from "~/utils/api";

const useAddOrRemoveProductToOrder = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateAddOrRemoveProductToOrder,
    isLoading: isLoadingAddOrRemoveProductToOrder,
    isError: isErrorAddOrRemoveProductToOrder,
  } = api.public.addorRemoveItemToOrder.useMutation({
    onMutate: async ({ sessionId, productId, choices, remove }) => {
      await apiContext.public.getCurrentOrder.cancel();
      const previousOrder = apiContext.public.getCurrentOrder.getData({ sessionId });

      if (!previousOrder) return { previousOrder };

      // Create a copy of the previous order
      const newOrder = {
        ...previousOrder,
        customizedProducts: previousOrder.customizedProducts.map((customizedProduct) => ({
          ...customizedProduct,
          choices: customizedProduct.choices.map((choice) => ({ ...choice })),
        })),
      };

      // Try to find a CustomizedProduct in the order with exactly the same choices
      const existingCustomizedProduct =
        previousOrder &&
        previousOrder.customizedProducts.find(
          (customizedProduct) =>
            customizedProduct.productId === productId &&
            customizedProduct.choices.length === choices.length &&
            customizedProduct.choices.every((choice) => choices.some((inputChoice) => inputChoice.id === choice.id))
        );

      // Increase the amount if it exists and there is more than 1
      if (existingCustomizedProduct && remove && existingCustomizedProduct.amount > 1) {
        newOrder.customizedProducts = newOrder.customizedProducts.map((customizedProduct) => {
          if (customizedProduct.id === existingCustomizedProduct.id)
            return { ...customizedProduct, amount: customizedProduct.amount - 1 };
          return customizedProduct;
        });
      }

      // Delete if it exists and there is only 1
      else if (existingCustomizedProduct && remove) {
        newOrder.customizedProducts = newOrder.customizedProducts.filter(
          (customizedProduct) => customizedProduct.id !== existingCustomizedProduct.id
        );
      }

      // Increase the amount if it exists
      else if (existingCustomizedProduct) {
        newOrder.customizedProducts = newOrder.customizedProducts.map((customizedProduct) => {
          if (customizedProduct.id === existingCustomizedProduct.id)
            return { ...customizedProduct, amount: customizedProduct.amount + 1 };
          return customizedProduct;
        });
      }

      // Add to order if it doesn't exist
      else {
        newOrder.customizedProducts.push({ id: -Math.round(Math.random() * 100000000), productId, amount: 1, choices });
      }

      apiContext.public.getCurrentOrder.setData({ sessionId }, newOrder);

      return { previousOrder };
    },
    onError: (err, { sessionId }, context) => {
      apiContext.public.getCurrentOrder.setData({ sessionId }, context?.previousOrder);
    },
    onSettled: async () => {
      await apiContext.public.getCurrentOrder.invalidate();
    },
  });

  return { mutateAddOrRemoveProductToOrder, isLoadingAddOrRemoveProductToOrder, isErrorAddOrRemoveProductToOrder };
};

export default useAddOrRemoveProductToOrder;

import { api } from "~/utils/api";

const useSetOrderAsDelivered = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateSetOrderAsDelivered,
    isLoading: isLoadingSetOrderAsDelivered,
    isError: isErrorSetOrderAsDelivered,
  } = api.private.setOrderAsDelivered.useMutation({
    onMutate: async ({ orderId }) => {
      await apiContext.private.getOrdersToDeliver.cancel();

      const previousOrders = apiContext.private.getOrdersToDeliver.getData();
      if (!previousOrders) return { previousOrders };

      const newOrders = previousOrders.filter((order) => order.id !== orderId);

      apiContext.private.getOrdersToDeliver.setData(undefined, newOrders);

      return { previousOrders };
    },
    onError: (err, data, context) => {
      apiContext.private.getOrdersToDeliver.setData(undefined, context?.previousOrders);
    },
    onSettled: () => {
      void apiContext.private.getOrdersToDeliver.invalidate();
    },
  });

  return { mutateSetOrderAsDelivered, isLoadingSetOrderAsDelivered, isErrorSetOrderAsDelivered };
};

export default useSetOrderAsDelivered;

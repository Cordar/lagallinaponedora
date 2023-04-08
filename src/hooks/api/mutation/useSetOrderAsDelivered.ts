import { api } from "~/utils/api";

const useSetOrderAsDelivered = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateSetOrderAsDelivered,
    isLoading: isLoadingSetOrderAsDelivered,
    isError: isErrorSetOrderAsDelivered,
  } = api.private.setOrderAsDelivered.useMutation({
    onSettled: () => {
      void apiContext.private.getOrdersToDeliver.invalidate();
    },
  });

  return { mutateSetOrderAsDelivered, isLoadingSetOrderAsDelivered, isErrorSetOrderAsDelivered };
};

export default useSetOrderAsDelivered;

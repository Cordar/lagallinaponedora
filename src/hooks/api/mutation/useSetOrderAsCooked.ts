import { api } from "~/utils/api";

const useSetOrderAsCooked = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateSetOrderAsCooked,
    isLoading: isLoadingSetOrderAsCooked,
    isError: isErrorSetOrderAsCooked,
  } = api.private.setOrderAsCooked.useMutation({
    onMutate: () => {
      apiContext.private.getOrdersToCook.setData(undefined, undefined);
    },
    onSuccess: () => {
      void apiContext.private.getOrdersToCook.invalidate();
      void apiContext.private.getOrdersToDeliver.invalidate();
      void apiContext.private.getTotalAmountOfDishesToCook.invalidate();
    },
  });

  return { mutateSetOrderAsCooked, isLoadingSetOrderAsCooked, isErrorSetOrderAsCooked };
};

export default useSetOrderAsCooked;

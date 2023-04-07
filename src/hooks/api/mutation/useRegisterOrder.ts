import { api } from "~/utils/api";

const useRegisterOrder = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateRegisterOrder,
    isLoading: isLoadingRegisterOrder,
    isError: isErrorRegisterOrder,
  } = api.public.registerOrder.useMutation({
    onSettled: () => {
      console.log("settle");
      void apiContext.public.getPaidOrders.invalidate();
      void apiContext.public.getCookedOrders.invalidate();
      void apiContext.public.getAreOrdersInProgress.invalidate();
    },
  });

  return { mutateRegisterOrder, isLoadingRegisterOrder, isErrorRegisterOrder };
};

export default useRegisterOrder;

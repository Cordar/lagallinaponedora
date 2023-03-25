import { api } from "~/utils/api";

const useUpdateOrderToPaid = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateUpdateOrderToPaid,
    isLoading: isLoadingUpdateOrderToPaid,
    isError: isErrorUpdateOrderToPaid,
  } = api.public.updateOrderToPaid.useMutation({
    onSettled: () => {
      void apiContext.public.getPaidOrders.invalidate();
    },
  });

  return { mutateUpdateOrderToPaid, isLoadingUpdateOrderToPaid, isErrorUpdateOrderToPaid };
};

export default useUpdateOrderToPaid;

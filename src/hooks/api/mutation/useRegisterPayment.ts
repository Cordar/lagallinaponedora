import { api } from "~/utils/api";

const useRegisterPayment = (onSuccess: () => void) => {
  const apiContext = api.useContext();

  const {
    mutate: mutateRegisterPayment,
    isLoading: isLoadingRegisterPayment,
    isError: isErrorRegisterPayment,
  } = api.public.registerPayment.useMutation({
    onSuccess: () => {
      void apiContext.public.getPaidOrders.invalidate();
    },
  });

  return { mutateRegisterPayment, isLoadingRegisterPayment, isErrorRegisterPayment };
};

export default useRegisterPayment;

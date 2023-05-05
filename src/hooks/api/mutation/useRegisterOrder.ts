import { api } from "~/utils/api";

const useRegisterOrder = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateRegisterOrder,
    isLoading: isLoadingRegisterOrder,
    isError: isErrorRegisterOrder,
  } = api.public.registerOrder.useMutation({});

  return { mutateRegisterOrder, isLoadingRegisterOrder, isErrorRegisterOrder };
};

export default useRegisterOrder;

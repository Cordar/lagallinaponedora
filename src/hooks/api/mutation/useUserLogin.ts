import { api } from "~/utils/api";

const useUserLogin = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateLoginCustomer,
    isError: isErrorLoginCustomer,
    isLoading: isLoadingLoginCustomer,
  } = api.public.loginCustomer.useMutation();

  return { mutateLoginCustomer, isErrorLoginCustomer, isLoadingLoginCustomer };
};

export default useUserLogin;

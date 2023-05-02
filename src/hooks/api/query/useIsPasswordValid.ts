import { api } from "~/utils/api";

const useIsPasswordValid = (password?: string) => {
  const {
    data: isPasswordValid,
    isFetching: isLoadingIsPasswordValid,
    isError: isErrorIsPasswordValid,
    error: errorIsPasswordValid,
  } = api.public.checkAdminPassword.useQuery({ password: password as string }, { enabled: !!password });

  return { isPasswordValid, isLoadingIsPasswordValid, isErrorIsPasswordValid, errorIsPasswordValid };
};

export default useIsPasswordValid;

import { api } from "~/utils/api";

const useIsPasswordValid = (password?: string) => {
  const {
    data: isPasswordValid,
    isFetching: isLoadingIsPasswordValid,
    isError: isErrorIsPasswordValid,
  } = api.public.checkPassword.useQuery({ password: password as string }, { enabled: !!password });

  return { isPasswordValid, isLoadingIsPasswordValid, isErrorIsPasswordValid };
};

export default useIsPasswordValid;

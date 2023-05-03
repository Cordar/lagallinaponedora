import { api } from "~/utils/api";

const useIsCodeValid = (code?: string) => {
  const {
    data: isCodeValid,
    isFetching: isLoadingIsCodeValid,
    isError: isErrorIsCodeValid,
    error: errorIsCodeValid,
  } = api.public.checkCode.useQuery({ code: code as string }, { enabled: !!code });

  return {
    isCodeValid,
    isLoadingIsCodeValid,
    isErrorIsCodeValid,
    errorIsCodeValid,
  };
};

export default useIsCodeValid;

import { api } from "~/utils/api";
import { ONE_DAY_MS } from "~/utils/constant";

const useOptions = () => {
  const {
    data: options,
    isLoading: isLoadingOptions,
    isError: isErrorOptions,
  } = api.public.getOptions.useQuery(undefined, { staleTime: ONE_DAY_MS });

  return { options, isLoadingOptions, isErrorOptions };
};

export default useOptions;

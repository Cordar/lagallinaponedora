import { api } from "~/utils/api";
import { ONE_DAY_MS } from "~/utils/constant";

const useSubproducts = () => {
  const {
    data: subproducts,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = api.public.getSubproducts.useQuery(undefined, { staleTime: ONE_DAY_MS });

  return { subproducts, isLoadingProduct, isErrorProduct };
};

export default useSubproducts;

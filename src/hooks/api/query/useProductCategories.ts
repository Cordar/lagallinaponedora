import { api } from "~/utils/api";
import { ONE_DAY_MS } from "~/utils/constant";

const useProducts = () => {
  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
  } = api.public.getProductCategories.useQuery(undefined, { staleTime: ONE_DAY_MS });

  return { productCategories, isLoadingProductCategories, isErrorProductCategories };
};

export default useProducts;

import { api } from "~/utils/api";
import { ONE_DAY } from "~/utils/constant";

const useProducts = () => {
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = api.public.getProducts.useQuery(undefined, { staleTime: ONE_DAY });

  return { products, isLoadingProducts, isErrorProducts };
};

export default useProducts;

import { api } from "~/utils/api";
import { ONE_DAY_MS } from "~/utils/constant";

const useProduct = (productId?: number) => {
  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = api.public.getProductById.useQuery(
    { productId: productId ?? -1 },
    { enabled: !!productId, staleTime: ONE_DAY_MS }
  );

  return { product, isLoadingProduct, isErrorProduct };
};

export default useProduct;

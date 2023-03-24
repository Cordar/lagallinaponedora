import { api } from "~/utils/api";
import { ONE_DAY } from "~/utils/constant";

const useProduct = (productId?: number) => {
  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = api.public.getProductWithChoiceGroups.useQuery(
    { productId: productId ?? -1 },
    { enabled: !!productId, staleTime: ONE_DAY }
  );

  return { product, isLoadingProduct, isErrorProduct };
};

export default useProduct;

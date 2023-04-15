import { api } from "~/utils/api";
import { ONE_MINUTE_MS } from "~/utils/constant";

const useTotalAmountOfDishesToCook = () => {
  const {
    data: totalAmountOfDishesToCook,
    isLoading: isLoadingTotalAmountOfDishesToCook,
    isError: isErrorTotalAmountOfDishesToCook,
  } = api.private.getTotalAmountOfDishesToCook.useQuery(undefined, { refetchInterval: ONE_MINUTE_MS / 2 });

  return { totalAmountOfDishesToCook, isLoadingTotalAmountOfDishesToCook, isErrorTotalAmountOfDishesToCook };
};

export default useTotalAmountOfDishesToCook;

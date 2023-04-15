import { api } from "~/utils/api";
import { ONE_MINUTE_MS } from "~/utils/constant";

const useOrderToCook = () => {
  const {
    data: cookedOrder,
    isLoading: isLoadingCookedOrder,
    isError: isErrorCookedOrder,
  } = api.private.getOrderToCook.useQuery(undefined, { refetchInterval: ONE_MINUTE_MS / 2 });

  return { cookedOrder, isLoadingCookedOrder, isErrorCookedOrder };
};

export default useOrderToCook;

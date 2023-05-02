import { api } from "~/utils/api";
import { ONE_MINUTE_MS } from "~/utils/constant";

const useOrderToCook = () => {
  const {
    data: cookedOrders,
    isLoading: isLoadingCookedOrders,
    isError: isErrorCookedOrders,
  } = api.private.getOrdersToCook.useQuery(undefined, { refetchInterval: ONE_MINUTE_MS / 2 });

  return { cookedOrders, isLoadingCookedOrders, isErrorCookedOrders };
};

export default useOrderToCook;

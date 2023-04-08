import { api } from "~/utils/api";
import { ONE_MINUTE_MS } from "~/utils/constant";

const useOrdersToDeliver = () => {
  const {
    data: ordersToDeliver,
    isLoading: isLoadingOrdersToDeliver,
    isError: isErrorOrdersToDeliver,
  } = api.private.getOrdersToDeliver.useQuery(undefined, { refetchInterval: ONE_MINUTE_MS });

  return { ordersToDeliver, isLoadingOrdersToDeliver, isErrorOrdersToDeliver };
};

export default useOrdersToDeliver;

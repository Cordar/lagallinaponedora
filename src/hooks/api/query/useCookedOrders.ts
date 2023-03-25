import { api } from "~/utils/api";
import { ONE_DAY_MS, ONE_MINUTE_MS } from "~/utils/constant";

const useCookedOrders = (sessionId?: string, autoRefresh?: boolean) => {
  const extraSettings = autoRefresh ? { refetchOnWindowFocus: false, refetchInterval: ONE_MINUTE_MS * 2 } : {};

  const {
    data: cookedOrders,
    isLoading,
    isFetching,
    isError: isErrorCookedOrders,
  } = api.public.getCookedOrders.useQuery(
    { sessionId: sessionId ?? "" },
    { staleTime: ONE_DAY_MS, enabled: !!sessionId, ...extraSettings }
  );

  const isLoadingCookedOrders = isLoading || isFetching;
  return { cookedOrders, isLoadingCookedOrders, isErrorCookedOrders };
};

export default useCookedOrders;

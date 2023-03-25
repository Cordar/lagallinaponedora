import { api } from "~/utils/api";
import { ONE_DAY_MS, ONE_MINUTE_MS } from "~/utils/constant";

const usePaidOrders = (sessionId?: string, autoRefresh?: boolean) => {
  const extraSettings = autoRefresh ? { refetchOnWindowFocus: false, refetchInterval: ONE_MINUTE_MS * 2 } : {};

  const {
    data: paidOrders,
    isLoading: isLoadingPaidOrders,
    isError: isErrorPaidOrders,
  } = api.public.getPaidOrders.useQuery(
    { sessionId: sessionId ?? "" },
    { staleTime: ONE_DAY_MS, enabled: !!sessionId, ...extraSettings }
  );

  return { paidOrders, isLoadingPaidOrders, isErrorPaidOrders };
};

export default usePaidOrders;

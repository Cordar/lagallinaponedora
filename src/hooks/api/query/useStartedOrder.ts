import { api } from "~/utils/api";
import { ONE_DAY_MS, ONE_MINUTE_MS } from "~/utils/constant";

const useStartedOrder = (sessionId?: string, autoRefresh?: boolean) => {
  const extraSettings = autoRefresh ? { refetchOnWindowFocus: false, refetchInterval: ONE_MINUTE_MS * 2 } : {};

  const {
    data: startedOrder,
    isLoading: isLoadingStartedOrder,
    isError: isErrorStartedOrder,
  } = api.public.getStartedOrder.useQuery(
    { sessionId: sessionId ?? "" },
    { staleTime: ONE_DAY_MS, enabled: !!sessionId, ...extraSettings }
  );

  return { startedOrder, isLoadingStartedOrder, isErrorStartedOrder };
};

export default useStartedOrder;

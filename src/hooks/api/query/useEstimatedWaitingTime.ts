import { api } from "~/utils/api";
import { ONE_MINUTE_MS } from "~/utils/constant";

const useEstimatedWaitingTime = (orderId?: number) => {
  const {
    data: estimatedWaitingTime,
    isLoading: isLoadingEstimatedWaitingTime,
    isError: isErrorEstimatedWaitingTime,
  } = api.public.getEstimatedWaitingTime.useQuery(
    { orderId: orderId ?? -1 },
    { enabled: !!orderId, refetchInterval: ONE_MINUTE_MS * 2 }
  );

  return { estimatedWaitingTime, isLoadingEstimatedWaitingTime, isErrorEstimatedWaitingTime };
};

export default useEstimatedWaitingTime;

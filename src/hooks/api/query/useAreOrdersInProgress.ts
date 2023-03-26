import { api } from "~/utils/api";
import { ONE_DAY_MS } from "~/utils/constant";

const useAreOrdersInProgress = (sessionId?: string) => {
  const {
    data: areOrdersInProgress,
    isLoading,
    isFetching,
    isError: isErrorAreOrdersInProgress,
  } = api.public.getAreOrdersInProgress.useQuery(
    { sessionId: sessionId ?? "" },
    { staleTime: ONE_DAY_MS, enabled: !!sessionId }
  );

  const isLoadingAreOrdersInProgress = isLoading || isFetching;
  return { areOrdersInProgress, isLoadingAreOrdersInProgress, isErrorAreOrdersInProgress };
};

export default useAreOrdersInProgress;

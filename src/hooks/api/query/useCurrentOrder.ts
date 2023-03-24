import { api } from "~/utils/api";
import { ONE_DAY } from "~/utils/constant";

const useCurrentOrder = (sessionId?: string) => {
  const {
    data: order,
    isLoading: isLoadingOrder,
    isError: isErrorOrder,
  } = api.public.getCurrentOrder.useQuery({ sessionId: sessionId ?? "" }, { staleTime: ONE_DAY, enabled: !!sessionId });

  return { order, isLoadingOrder, isErrorOrder };
};

export default useCurrentOrder;

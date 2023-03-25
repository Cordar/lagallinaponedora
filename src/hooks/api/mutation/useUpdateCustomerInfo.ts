import { api } from "~/utils/api";

const useUpdateCustomerInfo = () => {
  const {
    mutate: mutateUpdateCustomerInfo,
    isLoading: isLoadingUpdateCustomerInfo,
    isError: isErrorUpdateCustomerInfo,
  } = api.public.updateCustomerInfo.useMutation();

  return { mutateUpdateCustomerInfo, isLoadingUpdateCustomerInfo, isErrorUpdateCustomerInfo };
};

export default useUpdateCustomerInfo;

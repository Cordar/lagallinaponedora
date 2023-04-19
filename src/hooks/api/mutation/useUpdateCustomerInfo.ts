import { api } from "~/utils/api";

const useUpdateCustomerInfo = () => {
  const apiContext = api.useContext();

  const {
    mutate: mutateUpdateCustomerInfo,
    isLoading: isLoadingUpdateCustomerInfo,
    isError: isErrorUpdateCustomerInfo,
  } = api.public.getOrUpsertCustomer.useMutation({
    onSettled: () => {
      void apiContext.public.getCustomer.invalidate();
    },
  });

  return { mutateUpdateCustomerInfo, isLoadingUpdateCustomerInfo, isErrorUpdateCustomerInfo };
};

export default useUpdateCustomerInfo;

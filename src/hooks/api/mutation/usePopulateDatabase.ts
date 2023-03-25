import { api } from "~/utils/api";

const usePopulateDatabase = () => {
  const { mutate: populateDatabase } = api.private.populateDatabase.useMutation();

  return { populateDatabase };
};

export default usePopulateDatabase;

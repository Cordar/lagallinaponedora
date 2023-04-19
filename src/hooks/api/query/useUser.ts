import { useEffect, useState } from "react";
import uuid from "react-uuid";
import { api } from "~/utils/api";
import { ONE_DAY_MS, ONE_YEAR_MS, StorageKey } from "~/utils/constant";
import { getCookie, setCookie } from "~/utils/storage";

const useUser = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let cookie = getCookie(StorageKey.SESSION);
    if (!cookie) cookie = uuid();
    setCookie(StorageKey.SESSION, cookie, new Date(Date.now() + ONE_YEAR_MS), "/");

    setSessionId(cookie);
  }, []);

  const {
    data: dbUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = api.public.getCustomer.useQuery(
    { sessionId: sessionId as string },
    { enabled: !!sessionId, staleTime: ONE_DAY_MS }
  );
  let user = dbUser;
  if (user == null) {
    user = {
      sessionId: sessionId as string,
      id: -1,
      email: null,
      name: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      orders: [],
    };
  }
  return { user, isLoadingUser, isErrorUser };
};

export default useUser;

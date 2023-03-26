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
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = api.public.getOrCreateCustomer.useQuery(
    { sessionId: sessionId as string },
    { enabled: !!sessionId, staleTime: ONE_DAY_MS }
  );

  return { user, isLoadingUser, isErrorUser };
};

export default useUser;

import { useEffect, useState } from "react";
import uuid from "react-uuid";
import { api } from "~/utils/api";
import { Cookie, ONE_DAY, ONE_YEAR } from "~/utils/constant";
import useCookies from "../../useCookies";

const useUser = () => {
  const { setCookie, getCookie } = useCookies();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let cookie = getCookie(Cookie.SESSION);
    if (!cookie) cookie = uuid();
    setCookie(Cookie.SESSION, cookie, new Date(Date.now() + ONE_YEAR), "/");

    setSessionId(cookie);
  }, [getCookie, setCookie]);

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = api.public.getOrCreateCustomer.useQuery(
    { sessionId: sessionId as string },
    { enabled: !!sessionId, staleTime: ONE_DAY }
  );

  return { user, isLoadingUser, isErrorUser };
};

export default useUser;

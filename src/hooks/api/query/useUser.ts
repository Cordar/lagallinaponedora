import { useEffect, useRef } from "react";
import uuid from "react-uuid";
import { api } from "~/utils/api";
import { Cookie, ONE_DAY, ONE_YEAR } from "~/utils/constant";
import useCookies from "../../useCookies";

const useUser = (previousSessionId: string | null) => {
  const { setCookie } = useCookies();

  const sessionId = useRef(previousSessionId ?? uuid());

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = api.public.getOrCreateCustomer.useQuery({ sessionId: sessionId.current }, { staleTime: ONE_DAY });

  useEffect(() => {
    setCookie(Cookie.SESSION, sessionId.current, new Date(Date.now() + ONE_YEAR), "/");
  }, [setCookie]);

  return { user, isLoadingUser, isErrorUser };
};

export default useUser;

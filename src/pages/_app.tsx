import type { NextComponentType, NextPageContext } from "next";

import { api } from "~/utils/api";

import "~/styles/globals.css";

export interface PageProps {
  sessionId: string | null;
}

interface MyAppProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: PageProps;
}

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);

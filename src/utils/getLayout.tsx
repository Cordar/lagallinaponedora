import Head from "next/head";
import { type ReactElement } from "react";

const getLayout = (metaTitle: string, metaDescription: string) => {
  const Layout = (children: ReactElement) => {
    return (
      <>
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="relative flex min-h-screen flex-col gap-6 bg-slate-200 p-5">{children}</main>
      </>
    );
  };

  return Layout;
};

export default getLayout;

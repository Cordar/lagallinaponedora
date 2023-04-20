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
        <main className="relative m-auto flex h-full min-h-screen flex-col lg:max-w-xl">{children}</main>
      </>
    );
  };

  return Layout;
};

export default getLayout;

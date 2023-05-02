import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetServerSideProps, InferGetServerSidePropsType } from "next";
import AdminLayout from "~/components/AdminLayout";
import { createContextInner } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { NextPageWithLayout } from "../_app";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });

  const password = context.req.cookies[StorageKey.PASSWORD];
  const isAuthenticated = password ? await ssg.public.checkAdminPassword.fetch({ password }) : false;

  const props = { trpcState: ssg.dehydrate() };

  if (!isAuthenticated) return { redirect: { destination: Route.ADMIN, permanent: false }, props };
  return { props };
};

const AdminRegister: NextPageWithLayout = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const Layout = getLayout("La Gallina Ponedora | Caja", "Caja.");

  return Layout(
    <AdminLayout title="Caja" showBackButton>
      <></>
    </AdminLayout>
  );
};

export default AdminRegister;

import { type GetServerSideProps, type NextPage } from "next";
import AdminLayout from "~/components/AdminLayout";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "../_app";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = getTrpcSSGHelpers();

  const password = context.req.cookies[StorageKey.PASSWORD];
  const isAuthenticated = password ? await ssg.public.checkPassword.fetch({ password }) : false;

  const props = { trpcState: ssg.dehydrate() };

  if (!isAuthenticated) return { redirect: { destination: Route.ADMIN, permanent: false }, props };
  return { props };
};

const AdminDeliver: NextPage<PageProps> = () => {
  const Layout = getLayout("La Gallina Ponedora | Entrega", "Entrega.");

  return Layout(
    <AdminLayout title="Entrega" showBackButton>
      <></>
    </AdminLayout>
  );
};

export default AdminDeliver;

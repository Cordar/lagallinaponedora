import { type GetServerSideProps, type NextPage } from "next";
import Link from "next/link";
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

const AdminPanel: NextPage<PageProps> = () => {
  const Layout = getLayout("La Gallina Ponedora | Panel de administración", "Panel de administración.");

  return Layout(
    <AdminLayout title="Panel de administración">
      <div className="relative mt-16 flex grow flex-col items-center justify-center gap-5 p-5">
        <Link
          href={Route.ADMIN_TO_REGISTER}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 py-8 px-4 shadow-md"
        >
          <h2 className="w-full text-xl font-semibold uppercase tracking-wide">Caja</h2>
          <p className="w-full text-sm tracking-wide opacity-60">Crear pedidos que se pagan en persona.</p>
        </Link>

        <Link
          href={Route.ADMIN_TO_COOK}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 py-8 px-4 shadow-md"
        >
          <h2 className="w-full text-xl font-semibold uppercase tracking-wide">Cocina</h2>
          <p className="w-full text-sm tracking-wide opacity-60">Ver los pedidos pendientes de cocinar.</p>
        </Link>

        <Link
          href={Route.ADMIN_TO_DELIVER}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 py-8 px-4 shadow-md"
        >
          <h2 className="w-full text-xl font-semibold uppercase tracking-wide">Entrega</h2>
          <p className="w-full text-sm tracking-wide opacity-60">Ver los pedidos pendientes de entrega.</p>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;

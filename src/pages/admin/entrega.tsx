import { type GetServerSideProps, InferGetServerSidePropsType } from "next";
import { type ReactElement } from "react";
import AdminLayout from "~/components/AdminLayout";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import OrderNumber from "~/components/OrderNumber";
import OrderedProduct from "~/components/OrderedProduct";
import useSetOrderAsDelivered from "~/hooks/api/mutation/useSetOrderAsDelivered";
import useOrdersToDeliver from "~/hooks/api/query/useOrdersToDeliver";
import useAutoResetState from "~/hooks/useAutoResetState";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/routers/_app";
import { createContextInner } from "~/server/context";
import { NextPageWithLayout } from "../_app";
import InternalProductCard from "~/components/InternalProductCard";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  await ssg.public.getProductCategories.prefetch();
  await ssg.public.getOptions.prefetch();

  const password = req.cookies[StorageKey.PASSWORD];
  const isAuthenticated = password ? await ssg.public.checkAdminPassword.fetch({ password }) : false;

  const props = { trpcState: ssg.dehydrate() };

  if (!isAuthenticated) return { redirect: { destination: Route.ADMIN, permanent: false }, props };
  return { props };
};

const AdminDeliver: NextPageWithLayout = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const Layout = getLayout("La Gallina Ponedora | Entrega", "Entrega.");

  const { ordersToDeliver, isLoadingOrdersToDeliver, isErrorOrdersToDeliver } = useOrdersToDeliver();
  const { mutateSetOrderAsDelivered, isLoadingSetOrderAsDelivered, isErrorSetOrderAsDelivered } =
    useSetOrderAsDelivered();

  const container = (children: ReactElement) =>
    Layout(
      <AdminLayout title="Entrega" showBackButton>
        <div className="relative mt-16 flex grow flex-col gap-5 p-5">{children}</div>
      </AdminLayout>
    );

  if (isLoadingOrdersToDeliver) return container(<Loading />);

  if (isErrorOrdersToDeliver || !ordersToDeliver)
    return container(<ErrorMessage message="Hubo un error al cargar los pedidos." />);

  return container(
    <>
      {isErrorSetOrderAsDelivered && <ErrorMessage message="Hubo un error al marcar el pedido como entregado." />}

      {ordersToDeliver.length === 0 && <p>No hay pedidos para entregar.</p>}

      {ordersToDeliver.length > 0 &&
        ordersToDeliver.map(({ id, orderProduct, preferred_pickup_time, customer }) => (
          <InternalProductCard
            orderProducts={orderProduct}
            isLoading={isLoadingSetOrderAsDelivered}
            callbackFunction={mutateSetOrderAsDelivered}
            actionLabel="Entregado"
            id={id}
            preferred_pickup_time={preferred_pickup_time}
          >
            <p className="font-semibold tracking-wide">{customer.name}</p>
            <p
              className="font-norma l
              text-xs tracking-wide"
            >
              {customer.email}
            </p>
          </InternalProductCard>
        ))}
    </>
  );
};

export default AdminDeliver;

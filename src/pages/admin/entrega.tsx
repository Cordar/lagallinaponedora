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

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  await ssg.public.getProducts.prefetch();
  await ssg.public.getSubproducts.prefetch();

  const password = req.cookies[StorageKey.PASSWORD];
  const isAuthenticated = password ? await ssg.public.checkPassword.fetch({ password }) : false;

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

  const [confirmId, setConfirmId] = useAutoResetState<number | null>(null, 2000);

  if (isLoadingOrdersToDeliver) return container(<Loading />);

  if (isErrorOrdersToDeliver || !ordersToDeliver)
    return container(<ErrorMessage message="Hubo un error al cargar los pedidos." />);

  return container(
    <>
      {isErrorSetOrderAsDelivered && <ErrorMessage message="Hubo un error al marcar el pedido como entregado." />}

      {ordersToDeliver.length === 0 && <p>No hay pedidos para entregar.</p>}

      {ordersToDeliver.length > 0 &&
        ordersToDeliver.map(({ id, chosenProducts, customer }) => (
          <div key={id} className="flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
            <div key={id} className="flex w-full flex-col justify-center">
              <p className="font-semibold tracking-wide">{customer.name}</p>
              <p
                className="font-norma l
              text-xs tracking-wide"
              >
                {customer.email}
              </p>
            </div>

            <div className="flex w-full justify-between gap-4">
              <OrderNumber orderId={id} />

              {confirmId !== id && (
                <Button
                  label="ENTREGAR"
                  type="button"
                  onClick={() => setConfirmId(id)}
                  isDisabled={isLoadingSetOrderAsDelivered}
                />
              )}

              {confirmId === id && (
                <Button
                  label="CONFIRMAR"
                  color="bg-slate-900"
                  isDisabled={isLoadingSetOrderAsDelivered}
                  type="button"
                  onClick={() => mutateSetOrderAsDelivered({ orderId: id })}
                />
              )}
            </div>

            {chosenProducts
              .sort((a, b) => b.id - a.id)
              .map((chosenProduct) => (
                <OrderedProduct key={chosenProduct.id} chosenProduct={chosenProduct} showProductName />
              ))}
          </div>
        ))}
    </>
  );
};

export default AdminDeliver;

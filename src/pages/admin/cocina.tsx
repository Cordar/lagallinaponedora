import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetServerSideProps, InferGetServerSidePropsType } from "next";
import { type ReactElement } from "react";
import AdminLayout from "~/components/AdminLayout";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import OrderedProduct from "~/components/OrderedProduct";
import useSetOrderAsCooked from "~/hooks/api/mutation/useSetOrderAsCooked";
import useOrdersToCook from "~/hooks/api/query/useOrderToCook";
import useTotalAmountOfDishesToCook from "~/hooks/api/query/useTotalAmountOfDishesToCook";
import useAutoResetState from "~/hooks/useAutoResetState";
import { createContextInner } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { NextPageWithLayout } from "../_app";
import InternalProductCard from "~/components/InternalProductCard";
import OrderNumber from "~/components/OrderNumber";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  await ssg.public.getProductCategories.prefetch();
  await ssg.public.getOptions.prefetch();

  const password = context.req.cookies[StorageKey.PASSWORD];
  const isAuthenticated = password ? await ssg.public.checkAdminPassword.fetch({ password }) : false;

  const props = { trpcState: ssg.dehydrate() };

  if (!isAuthenticated) return { redirect: { destination: Route.ADMIN, permanent: false }, props };
  return { props };
};

const AdminCook: NextPageWithLayout = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const Layout = getLayout("La Gallina Ponedora | Cocina", "Cocina.");

  const [confirmId, setConfirmId] = useAutoResetState<number | null>(null, 2000);

  const { cookedOrders, isLoadingCookedOrders, isErrorCookedOrders } = useOrdersToCook();
  const { mutateSetOrderAsCooked, isLoadingSetOrderAsCooked, isErrorSetOrderAsCooked } = useSetOrderAsCooked();

  const container = (children: ReactElement) =>
    Layout(
      <AdminLayout title="Cocina" showBackButton>
        <div className="relative mt-16 flex grow flex-col gap-5 p-5">{children}</div>
      </AdminLayout>
    );

  if (isLoadingCookedOrders) return container(<Loading />);

  if (isErrorCookedOrders || !cookedOrders)
    return container(<ErrorMessage message="Hubo un error al cargar los pedidos." />);

  return container(
    <>
      {isErrorSetOrderAsCooked && <ErrorMessage message="Hubo un error al marcar el pedido como cocinado." />}

      {cookedOrders.length === 0 && <p>No hay pedidos para cocinar.</p>}

      {cookedOrders.length > 0 &&
        cookedOrders.map(({ id, orderProduct, preferred_pickup_time }) => (
          <div key={id} className="flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
            <InternalProductCard orderProducts={orderProduct}></InternalProductCard>
            <div className="flex w-full justify-between gap-4">
              <OrderNumber orderId={id} small />

              {preferred_pickup_time && new Date(preferred_pickup_time).toLocaleTimeString()}

              {confirmId !== id && (
                <Button
                  label="COCINADO"
                  type="button"
                  onClick={() => setConfirmId(id)}
                  isDisabled={isLoadingSetOrderAsCooked}
                />
              )}

              {confirmId === id && (
                <Button
                  label="CONFIRMAR"
                  color="bg-slate-900"
                  isDisabled={isLoadingSetOrderAsCooked}
                  type="button"
                  onClick={() => mutateSetOrderAsCooked({ orderId: id })}
                />
              )}
            </div>
          </div>
        ))}
    </>
  );
};

export default AdminCook;

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
          <InternalProductCard
            orderProducts={orderProduct}
            id={id}
            preferred_pickup_time={preferred_pickup_time}
            isLoading={isLoadingCookedOrders}
            callbackFunction={mutateSetOrderAsCooked}
            actionLabel="Cocinado"
            isNumberSmall
          ></InternalProductCard>
        ))}
    </>
  );
};

export default AdminCook;

import { type GetServerSideProps, type NextPage } from "next";
import { type ReactElement } from "react";
import AdminLayout from "~/components/AdminLayout";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import OrderedProduct from "~/components/OrderedProduct";
import useSetOrderAsCooked from "~/hooks/api/mutation/useSetOrderAsCooked";
import useOrderToCook from "~/hooks/api/query/useOrderToCook";
import useTotalAmountOfDishesToCook from "~/hooks/api/query/useTotalAmountOfDishesToCook";
import useAutoResetState from "~/hooks/useAutoResetState";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "../_app";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = getTrpcSSGHelpers();
  await ssg.public.getProducts.prefetch();
  await ssg.public.getSubproducts.prefetch();

  const password = context.req.cookies[StorageKey.PASSWORD];
  const isAuthenticated = password ? await ssg.public.checkPassword.fetch({ password }) : false;

  const props = { trpcState: ssg.dehydrate() };

  if (!isAuthenticated) return { redirect: { destination: Route.ADMIN, permanent: false }, props };
  return { props };
};

const AdminCook: NextPage<PageProps> = () => {
  const Layout = getLayout("La Gallina Ponedora | Cocina", "Cocina.");

  const [confirm, setConfirm] = useAutoResetState(false, 2000);

  const { totalAmountOfDishesToCook, isLoadingTotalAmountOfDishesToCook, isErrorTotalAmountOfDishesToCook } =
    useTotalAmountOfDishesToCook();
  const { cookedOrder, isLoadingCookedOrder, isErrorCookedOrder } = useOrderToCook();
  const { mutateSetOrderAsCooked, isLoadingSetOrderAsCooked, isErrorSetOrderAsCooked } = useSetOrderAsCooked();

  const container = (children: ReactElement) => (
    <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
      <p className="font-semibold tracking-wide">{"Platos pendientes pendientes"}</p>
      {children}
    </div>
  );

  const orderContainer = (children: ReactElement, orderId?: number) => (
    <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full justify-between gap-4">
          <p className="font-semibold tracking-wide">{"Pedido a cocinar"}</p>
          {orderId && <p className="text-2xl font-bold tracking-wide">{orderId}</p>}
        </div>

        {children}
      </div>
    </div>
  );

  let totalAmountOfDishesToCookContainer = container(<></>);
  if (isLoadingTotalAmountOfDishesToCook) totalAmountOfDishesToCookContainer = container(<Loading />);
  else if (isErrorTotalAmountOfDishesToCook || !totalAmountOfDishesToCook)
    totalAmountOfDishesToCookContainer = container(
      <ErrorMessage message="Hubo un error al cargar los platos pendientes." />
    );
  else if (!Object.entries(totalAmountOfDishesToCook).length)
    totalAmountOfDishesToCookContainer = container(<p>No hay platos pendientes.</p>);
  else
    totalAmountOfDishesToCookContainer = container(
      <div className="flex flex-wrap gap-3">
        {Object.entries(totalAmountOfDishesToCook).map(([dish, amount]) => (
          <div className="flex w-fit gap-2 rounded-lg border border-opacity-10 bg-slate-100 p-2" key={dish}>
            <p className="text-sm tracking-wide">{dish}</p>
            <p className="text-sm font-medium tracking-wide">{amount}</p>
          </div>
        ))}
      </div>
    );

  let cookedOrderContainer = orderContainer(<></>);
  if (isLoadingCookedOrder) cookedOrderContainer = orderContainer(<Loading />);
  else if (isErrorCookedOrder || typeof cookedOrder !== "object")
    cookedOrderContainer = orderContainer(<ErrorMessage message="Hubo un error al cargar el pedido a cocinar." />);
  else if (!cookedOrder) cookedOrderContainer = orderContainer(<p>No hay pedidos a cocinar.</p>);
  else
    cookedOrderContainer = orderContainer(
      <>
        {cookedOrder.chosenProducts
          .sort((a, b) => b.id - a.id)
          .map((chosenProduct) => (
            <OrderedProduct key={chosenProduct.id} chosenProduct={chosenProduct} showProductName />
          ))}

        {!confirm && (
          <Button
            label="COCINADO"
            type="button"
            onClick={() => setConfirm(true)}
            isDisabled={isLoadingSetOrderAsCooked}
          />
        )}

        {confirm && (
          <Button
            label="CONFIRMAR"
            color="bg-slate-900"
            isDisabled={isLoadingSetOrderAsCooked}
            type="button"
            onClick={() => mutateSetOrderAsCooked({ orderId: cookedOrder.id })}
          />
        )}

        {isErrorSetOrderAsCooked && <ErrorMessage message="Hubo un error al marcar el pedido como entregado." />}
      </>,
      cookedOrder.id
    );

  return Layout(
    <AdminLayout title="Cocina" showBackButton>
      <div className="relative mt-16 flex w-screen grow flex-col gap-5 overflow-hidden p-5">
        {totalAmountOfDishesToCookContainer}
        {cookedOrderContainer}
      </div>
    </AdminLayout>
  );
};

export default AdminCook;

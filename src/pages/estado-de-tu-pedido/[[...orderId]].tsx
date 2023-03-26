import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiArrowLeftLine, RiErrorWarningLine } from "react-icons/ri";
import CookedOrder from "~/components/CookedOrder";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import OrderNumber from "~/components/OrderNumber";
import PaidOrder from "~/components/PaidOrder";
import useRegisterPayment from "~/hooks/api/mutation/useRegisterPayment";
import useCookedOrders from "~/hooks/api/query/useCookedOrders";
import usePaidOrders from "~/hooks/api/query/usePaidOrders";
import useUser from "~/hooks/api/query/useUser";
import useStartedOrder from "~/hooks/useStartedOrder";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "../_app";

const parseQueryOrderId = (query: string | string[] | undefined) => {
  if (!query) return undefined;
  if (typeof query === "string") return parseInt(query);
  if (!query[0]) return undefined;
  return parseInt(query[0]);
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = getTrpcSSGHelpers();
  await ssg.public.getProducts.prefetch();
  return { props: { trpcState: ssg.dehydrate() }, revalidate: ONE_HOUR_MS / 1000 };
};

const OrderStatus: NextPage<PageProps> = () => {
  const { query } = useRouter();
  const Layout = getLayout("La Gallina Ponedora | Tu Pedido", "Revisa tu pedido y mándalo a cocina.");

  const [orderId, setOrderId] = useState(parseQueryOrderId(query.orderId) ?? null);

  const { user, isErrorUser } = useUser();
  const { clearStartedOrder } = useStartedOrder();
  const { cookedOrders, isLoadingCookedOrders, isErrorCookedOrders } = useCookedOrders(user?.sessionId, true);
  const { paidOrders, isLoadingPaidOrders, isErrorPaidOrders } = usePaidOrders(user?.sessionId, true);

  const { mutateRegisterPayment, isErrorRegisterPayment } = useRegisterPayment(() => {
    clearStartedOrder();
    setOrderId(null);
  });

  useEffect(() => {
    // TODO very important, only do this if the payment provider has returned a success
    if (orderId) mutateRegisterPayment({ orderId });
  }, [mutateRegisterPayment, orderId]);

  if (isErrorUser || isErrorPaidOrders || isErrorCookedOrders)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message="No se ha podido cargar la página" />
      </div>
    );

  return Layout(
    <div className="relative flex grow flex-col gap-5 bg-lgp-orange-light p-5">
      <div className="flex w-full items-center gap-3">
        <Link href={Route.HOME} className="w-fit">
          <RiArrowLeftLine className="h-8 w-8" />
        </Link>
      </div>

      {isErrorRegisterPayment && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-slate-50 p-4">
          <RiErrorWarningLine className="h-16 w-16 text-red-600" />

          <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">
            Ha habido un problema al registrar su pedido
          </h3>

          <p className="text-ellipsis text-xs tracking-wide text-slate-600">
            Por favor, ve al food truck y muestra esto para que podamos empezar a preparar tu pedido.
          </p>

          {orderId && <OrderNumber orderId={orderId} />}
        </div>
      )}

      {cookedOrders?.map(
        (order, i) =>
          order.customizedProducts.length > 0 && <CookedOrder key={order.id} order={order} first={i === 0} />
      )}

      {paidOrders?.map(
        (order, i) => order.customizedProducts.length > 0 && <PaidOrder key={order.id} order={order} first={i === 0} />
      )}

      {(isLoadingCookedOrders || isLoadingPaidOrders) && <Loading />}
    </div>
  );
};

export default OrderStatus;

import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
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
import { createContextInner } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import getLocaleObject from "~/utils/locale/getLocaleObject";
import { type NextPageWithLayout } from "../_app";

const parseQueryOrderId = (query: ParsedUrlQuery) => {
  if (!query) return undefined;
  if (!query.orderId) return undefined;
  if (!query.orderId[0]) return undefined;
  return parseInt(query.orderId[0]);
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  locale = locale?.toUpperCase();

  const password = req.cookies[StorageKey.ORDER_PASSWORD];
  const isAdmin = password == "admin_lgp_bioc2023";
  const isStaff = password == "bioc2023lgp";

  const props = { trpcState: ssg.dehydrate(), isAdmin, isStaff, locale };

  return { props };
};

const OrderStatus: NextPageWithLayout = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isAdmin, isStaff, locale } = props;
  const locales = getLocaleObject(locale);
  const { query, push } = useRouter();
  const Layout = getLayout(locales.estadoDeTuPedido.title, locales.estadoDeTuPedido.description);

  const queryParams = query;
  const isPaymentDone = queryParams.Ds_MerchantParameters != undefined || isAdmin || isStaff;
  const [orderId, setOrderId] = useState(parseQueryOrderId(queryParams) ?? null);

  const { user, isLoadingUser, isErrorUser } = useUser();
  const { clearStartedOrder } = useStartedOrder();
  const { cookedOrders, isLoadingCookedOrders, isErrorCookedOrders } = useCookedOrders(user?.sessionId, true);
  const { paidOrders, isLoadingPaidOrders, isErrorPaidOrders } = usePaidOrders(user?.sessionId, true);

  const { mutateRegisterPayment, isErrorRegisterPayment } = useRegisterPayment(() => {
    clearStartedOrder();
    setOrderId(null);
  });

  useEffect(() => {
    if (orderId && isPaymentDone)
      mutateRegisterPayment(
        { orderId },
        {
          onSuccess: () => {
            void push(Route.ORDER_STATUS);
          },
        }
      );
  }, [mutateRegisterPayment, orderId, isPaymentDone]);

  if (isErrorUser || isErrorPaidOrders || isErrorCookedOrders)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message={locales.pageLoadError} />
      </div>
    );

  return Layout(
    <div className="relative flex grow flex-col gap-5 bg-lgp-background p-5">
      <div className="flex w-full items-center gap-3">
        <Link href={Route.HOME} className="w-fit">
          <RiArrowLeftLine className="h-8 w-8" />
        </Link>
      </div>

      {isErrorRegisterPayment && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-slate-50 p-4">
          <RiErrorWarningLine className="h-16 w-16 text-red-600" />

          <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">{locales.forms.error}</h3>

          <p className="text-ellipsis text-xs tracking-wide text-slate-600">
            {locales.estadoDeTuPedido.instructionsPickUp}
          </p>
          {orderId && <OrderNumber orderId={orderId} showText locales={locales} />}
        </div>
      )}

      {cookedOrders?.map(
        (order, i) =>
          order.orderProduct.length > 0 && (
            <CookedOrder key={order.id} order={order} first={i === 0} locales={locales} />
          )
      )}

      {paidOrders?.map(
        (order, i) =>
          order.orderProduct.length > 0 && <PaidOrder key={order.id} order={order} first={i === 0} locales={locales} />
      )}

      {(isLoadingUser || isLoadingCookedOrders || isLoadingPaidOrders) && <Loading />}
    </div>
  );
};

export default OrderStatus;

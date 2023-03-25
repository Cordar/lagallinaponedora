import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import OrderedProduct from "~/components/OrderedProduct";
import useUpdateOrderToPaid from "~/hooks/api/mutation/useUpdateOrderToPaid";
import usePaidOrders from "~/hooks/api/query/usePaidOrders";
import useUser from "~/hooks/api/query/useUser";
import { Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { type PageProps } from "../_app";

const Home: NextPage<PageProps> = () => {
  const { query } = useRouter();
  const Layout = getLayout("La Gallina Ponedora | Tu Pedido", "Revisa tu pedido y mándalo a cocina.");

  const orderId = query.orderId ? parseInt(query.orderId as string) : undefined;

  const { user, isErrorUser } = useUser();
  const { paidOrders, isLoadingPaidOrders, isErrorPaidOrders } = usePaidOrders(user?.sessionId, true);

  const { mutateUpdateOrderToPaid, isErrorUpdateOrderToPaid } = useUpdateOrderToPaid();

  const updatedToPaid = useRef(false);
  useEffect(() => {
    // TODO very important, only do this if the payment provider has returned a success
    if (orderId && !updatedToPaid.current) {
      updatedToPaid.current = true;
      mutateUpdateOrderToPaid({ orderId });
    }
  }, [mutateUpdateOrderToPaid, orderId, paidOrders, user]);

  if (isLoadingPaidOrders) return Layout(<Loading />);

  if (isErrorUser || isErrorPaidOrders)
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

      {paidOrders?.map(
        (order, i) =>
          order?.customizedProducts && (
            <div key={order.id} className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
              {i == 0 && (
                <>
                  <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">
                    Preparando tu pedido
                  </h3>

                  <div className="flex w-full justify-center">
                    <Image
                      src="/cooking.gif"
                      className="h-24 w-24 mix-blend-darken"
                      alt="animación de una olla cocinando"
                      width={256}
                      height={256}
                    />
                  </div>
                </>
              )}

              {i !== 0 && (
                <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">En la cola de cocina</h3>
              )}

              <div className="mb-5 flex w-full flex-col items-center justify-center">
                {/* TODO add an estimated time to each product and calculate this when getting the paid orders */}
                <h2 className="text-ellipsis text-2xl font-semibold tracking-wide">30 min</h2>
                <p className="text-ellipsis text-xs tracking-wide text-slate-600">Tiempo de espera aproximado</p>
              </div>

              {order.customizedProducts
                .sort((a, b) => b.id - a.id)
                .map((customizedProduct) => (
                  <OrderedProduct key={customizedProduct.id} customizedProduct={customizedProduct} />
                ))}

              {i == 0 && (
                <p className="text-ellipsis text-xs tracking-wide text-slate-600">
                  Te avisaremos por email cuando tu pedido esté listo y te llamaremos por tu nombre.
                </p>
              )}
            </div>
          )
      )}

      <div className="flex flex-col justify-center gap-4 rounded-lg "></div>
    </div>
  );
};

export default Home;

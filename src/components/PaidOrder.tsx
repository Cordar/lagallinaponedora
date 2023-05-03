import Image from "next/image";
import useEstimatedWaitingTime from "~/hooks/api/query/useEstimatedWaitingTime";
import ErrorMessage from "./ErrorMessage";
import OrderedProduct from "./OrderedProduct";
import { Order, OrderProduct, OrderProductOptionGroupOption, Product } from "@prisma/client";
import getRandomNumberId from "~/utils/getRandomNumberId";
import { LocaleObject } from "~/utils/locale/Locale";

export interface PaidOrderProps {
  order: Order & {
    orderProduct: (OrderProduct & {
      orderProductOptionGroupOption: OrderProductOptionGroupOption[];
      product: Product;
    })[];
  };
  first?: boolean;
  locales: LocaleObject;
}

const PaidOrder = ({ order, first, locales }: PaidOrderProps) => {
  const { isLoadingEstimatedWaitingTime, isErrorEstimatedWaitingTime } = useEstimatedWaitingTime(order.id);

  return (
    <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
      {first && (
        <>
          <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">
            {locales.estadoDeTuPedido.prepararPedido}
          </h3>

          <div className="flex w-full justify-center">
            <Image
              src="/cooking.gif"
              className="h-24 w-24 mix-blend-darken"
              alt="animación de una olla cocinando"
              width={256}
              height={256}
              priority
            />
          </div>
        </>
      )}

      {!first && (
        <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">
          {locales.estadoDeTuPedido.cookQueue}
        </h3>
      )}

      <div className="mb-5 flex w-full flex-col items-center justify-center">
        {isLoadingEstimatedWaitingTime && (
          <p className="text-ellipsis text-xl font-semibold tracking-wide">{locales.calculando}</p>
        )}

        {isErrorEstimatedWaitingTime && (
          <ErrorMessage message="Hubo un error al calcular el tiempo estimado de espera." />
        )}
      </div>

      {order.orderProduct
        .sort((a, b) => b.product.order - a.product.order)
        .map((orderProduct) => {
          let chosenProduct = {
            id: orderProduct.id,
            productId: orderProduct.productId,
            amount: orderProduct.amount,
            options: orderProduct.orderProductOptionGroupOption.map((option) => ({
              id: -getRandomNumberId(),
              ...option,
            })),
          };

          return (
            <OrderedProduct key={orderProduct.id} orderProduct={chosenProduct} showProductName locales={locales} />
          );
        })}

      {first && (
        <p className="text-ellipsis text-xs tracking-wide text-slate-600">
          Te avisaremos por esta pantalla cuando tu pedido esté listo y podrás recogerlo en la foodtruck.
        </p>
      )}
    </div>
  );
};

export default PaidOrder;

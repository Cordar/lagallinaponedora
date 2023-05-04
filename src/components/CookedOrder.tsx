import Image from "next/image";
import OrderNumber from "./OrderNumber";
import OrderedProduct from "./OrderedProduct";
import { Order, OrderProduct, OrderProductOptionGroupOption, Product } from "@prisma/client";
import getRandomNumberId from "~/utils/getRandomNumberId";
import { LocaleObject } from "~/utils/locale/Locale";

export interface CookedOrderProps {
  order: Order & {
    orderProduct: (OrderProduct & {
      orderProductOptionGroupOption: OrderProductOptionGroupOption[];
      product: Product;
    })[];
  };
  first?: boolean;
  locales: LocaleObject;
}

const CookedOrder = ({ order, first, locales }: CookedOrderProps) => {
  return (
    <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
      <div key={order.id} className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
        {first && (
          <>
            <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">
              {locales.estadoDeTuPedido.orderReady}
            </h3>

            <div className="flex w-full justify-center">
              <Image
                src="/waiting.gif"
                className="h-24 w-24 mix-blend-darken"
                alt="animación de un plato siendo revelado"
                width={256}
                height={256}
                priority
              />
            </div>
          </>
        )}

        {!first && (
          <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">
            {locales.estadoDeTuPedido.orderAlsoWaiting}
          </h3>
        )}

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

        <p className="text-ellipsis text-xs tracking-wide text-slate-600">
          {locales.estadoDeTuPedido.comeToTheFoodTruck}
        </p>

        <OrderNumber orderId={order.id} showText locales={locales} />
      </div>
    </div>
  );
};

export default CookedOrder;

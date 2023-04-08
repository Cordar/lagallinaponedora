import Image from "next/image";
import { type OrderWithChosenProducts } from "~/utils/types";
import OrderNumber from "./OrderNumber";
import OrderedProduct from "./OrderedProduct";

export interface CookedOrderProps {
  order: OrderWithChosenProducts;
  first?: boolean;
}

const CookedOrder = ({ order, first }: CookedOrderProps) => {
  return (
    <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
      <div key={order.id} className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
        {first && (
          <>
            <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">¡Tu pedido está listo!</h3>

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
            ¡Este pedido también te espera!
          </h3>
        )}

        {order.chosenProducts
          .sort((a, b) => b.id - a.id)
          .map((chosenProduct) => (
            <OrderedProduct key={chosenProduct.id} chosenProduct={chosenProduct} showProductName />
          ))}

        <p className="text-ellipsis text-xs tracking-wide text-slate-600">
          Acércate al food truck y muestra esta pantalla
        </p>

        <OrderNumber orderId={order.id} showText />
      </div>
    </div>
  );
};

export default CookedOrder;

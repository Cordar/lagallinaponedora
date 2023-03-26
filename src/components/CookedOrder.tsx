import Image from "next/image";
import { type OrderWithCustomizedProducts } from "~/utils/types";
import OrderedProduct from "./OrderedProduct";
import OrderNumber from "./OrderNumber";

export interface CookedOrderProps {
  order: OrderWithCustomizedProducts;
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

        {order.customizedProducts
          .sort((a, b) => b.customizedProduct.id - a.customizedProduct.id)
          .map((customizedProductOnOrder) => (
            <OrderedProduct
              key={customizedProductOnOrder.customizedProduct.id}
              customizedProduct={customizedProductOnOrder.customizedProduct}
            />
          ))}

        <p className="text-ellipsis text-xs tracking-wide text-slate-600">
          Acércate al food truck y muestra esta pantalla
        </p>

        <OrderNumber orderId={order.id} />
      </div>
    </div>
  );
};

export default CookedOrder;

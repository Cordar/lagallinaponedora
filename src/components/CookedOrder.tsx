import { type Choice, type CustomizedProduct, type Order } from "@prisma/client";
import Image from "next/image";
import OrderedProduct from "./OrderedProduct";
import OrderNumber from "./OrderNumber";

export interface CookedOrderProps {
  order: Order & { customizedProducts: (CustomizedProduct & { choices: Choice[] })[] };
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
                alt="animación de una olla cocinando"
                width={256}
                height={256}
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
          .sort((a, b) => b.id - a.id)
          .map((customizedProduct) => (
            <OrderedProduct key={customizedProduct.id} customizedProduct={customizedProduct} />
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

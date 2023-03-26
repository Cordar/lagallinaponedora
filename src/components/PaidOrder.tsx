import { type Choice, type CustomizedProduct, type Order } from "@prisma/client";
import Image from "next/image";
import useEstimatedWaitingTime from "~/hooks/api/query/useEstimatedWaitingTime";
import ErrorMessage from "./ErrorMessage";
import OrderedProduct from "./OrderedProduct";

export interface PaidOrderProps {
  order: Order & { customizedProducts: (CustomizedProduct & { choices: Choice[] })[] };
  first?: boolean;
}

const PaidOrder = ({ order, first }: PaidOrderProps) => {
  const { estimatedWaitingTime, isLoadingEstimatedWaitingTime, isErrorEstimatedWaitingTime } = useEstimatedWaitingTime(
    order.id
  );

  return (
    <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
      {first && (
        <>
          <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">Preparando tu pedido</h3>

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
        <h3 className="text-ellipsis text-center text-lg font-semibold tracking-wide">En la cola de cocina</h3>
      )}

      <div className="mb-5 flex w-full flex-col items-center justify-center">
        {isLoadingEstimatedWaitingTime && (
          <p className="text-ellipsis text-xl font-semibold tracking-wide">Calculando...</p>
        )}

        {isErrorEstimatedWaitingTime && (
          <ErrorMessage message="Hubo un error al calcular el tiempo estimado de espera." />
        )}

        {typeof estimatedWaitingTime === "number" && (
          <h2 className="text-ellipsis text-xl font-semibold tracking-wide">{`${Math.max(
            estimatedWaitingTime,
            1
          )} min`}</h2>
        )}

        <p className="text-ellipsis text-xs tracking-wide text-slate-600">Tiempo de espera estimado</p>
      </div>

      {order.customizedProducts
        .sort((a, b) => b.id - a.id)
        .map((customizedProduct) => (
          <OrderedProduct key={customizedProduct.id} customizedProduct={customizedProduct} />
        ))}

      {first && (
        <p className="text-ellipsis text-xs tracking-wide text-slate-600">
          Te avisaremos por email cuando tu pedido esté listo y te llamaremos por tu nombre.
        </p>
      )}
    </div>
  );
};

export default PaidOrder;

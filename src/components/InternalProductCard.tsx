import { Option, Order, OrderProduct, OrderProductOptionGroupOption, Product } from "@prisma/client";
import { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import OrderNumber from "./OrderNumber";
import useAutoResetState from "~/hooks/useAutoResetState";
import Button from "./Button";

export interface InternalProductCardProps {
  orderProducts: (OrderProduct & {
    orderProductOptionGroupOption: OrderProductOptionGroupOption & { option: Option }[];
    product: Product;
  })[];
  id: number;
  preferred_pickup_time: string | null;
  isLoading: boolean;
  callbackFunction: any;
  actionLabel: string;
  children: any;
  isNumberSmall: boolean;
}

const InternalProductCard = ({
  orderProducts,
  id,
  preferred_pickup_time,
  isLoading,
  callbackFunction,
  actionLabel,
  children,
  isNumberSmall,
}: InternalProductCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [confirmId, setConfirmId] = useAutoResetState<number | null>(null, 2000);

  return (
    <>
      <div key={id} className="flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
        {isOpen && (
          <>
            <div className="flex justify-between">
              <OrderNumber orderId={id} small={isNumberSmall} />
              <h3 className={isNumberSmall ? "text-3xl" : "text-s"}>{preferred_pickup_time}</h3>
              <RiArrowUpSLine size="50" onClick={() => setIsOpen(false)} />
            </div>

            <div className={"flex flex-col items-center gap-1 "}>
              {children}
              {orderProducts.map((orderProduct) => (
                <div
                  className="flex w-full items-center justify-between gap-1 rounded-lg border border-opacity-10 bg-slate-100 p-2"
                  key={orderProduct.id}
                >
                  <div className="flex grow gap-1">
                    <p className="text-xs font-medium tracking-wide">
                      {orderProduct.product.internalName + "_"}
                      {orderProduct.orderProductOptionGroupOption.map(
                        (orderProductOptionGroupOption) => orderProductOptionGroupOption.option.internalName + "_"
                      )}
                    </p>
                  </div>
                  <div>
                    <p>{orderProduct.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            {confirmId !== id && (
              <Button label={actionLabel} type="button" onClick={() => setConfirmId(id)} isDisabled={isLoading} />
            )}

            {confirmId === id && (
              <Button
                label="CONFIRMAR"
                color="bg-slate-900"
                isDisabled={isLoading}
                type="button"
                onClick={() => callbackFunction({ orderId: id })}
              />
            )}
          </>
        )}
        {!isOpen && (
          <>
            <div className="flex justify-between" onClick={() => setIsOpen(true)}>
              <OrderNumber orderId={id} small />

              <h3 className={isNumberSmall ? "text-3xl" : "text-s"}>{preferred_pickup_time}</h3>

              {confirmId !== id && (
                <Button label={actionLabel} type="button" onClick={() => setConfirmId(id)} isDisabled={isLoading} />
              )}

              {confirmId === id && (
                <Button
                  label="CONFIRMAR"
                  color="bg-slate-900"
                  isDisabled={isLoading}
                  type="button"
                  onClick={() => callbackFunction({ orderId: id })}
                />
              )}
              <RiArrowDownSLine size="50" />
            </div>
            <div>{children}</div>
          </>
        )}
      </div>
    </>
  );
};

export default InternalProductCard;

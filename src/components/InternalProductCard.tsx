import { Option, OrderProduct, OrderProductOptionGroupOption, Product } from "@prisma/client";
import { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

export interface InternalProductCardProps {
  orderProducts: (OrderProduct & {
    orderProductOptionGroupOption: OrderProductOptionGroupOption & { option: Option }[];
    product: Product;
  })[];
}

const InternalProductCard = ({ orderProducts }: InternalProductCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {isOpen && (
        <>
          <div className="ml-auto" onClick={() => setIsOpen(false)}>
            <RiArrowUpSLine size="50" />
          </div>

          <div className={"flex flex-col items-center gap-1 "}>
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
        </>
      )}
      {!isOpen && (
        <div className="ml-auto" onClick={() => setIsOpen(true)}>
          <RiArrowDownSLine size="50" />
        </div>
      )}
    </>
  );
};

export default InternalProductCard;

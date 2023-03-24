import { Product, type Choice, type ChoiceGroup, type CustomizedProduct } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";
import useAddOrRemoveProductToOrder from "~/hooks/api/mutation/useAddOrRemoveProductToOrder";
import { Route } from "~/utils/constant";
import ErrorMessage from "./ErrorMessage";

export interface ProductProps {
  product: Product & { choiceGroups: ChoiceGroup[] };
  orderProducts?: (CustomizedProduct & { choices: Choice[] })[];
  orderId?: number;
  sessionId?: string;
}

const Product = ({ product, orderProducts, orderId, sessionId }: ProductProps) => {
  const { id, name, price, imageSrc, choiceGroups } = product;

  const { mutateAddOrRemoveProductToOrder, isErrorAddOrRemoveProductToOrder } = useAddOrRemoveProductToOrder();

  const handleAddProduct = (choices: Choice[]) => {
    if (!orderId || !sessionId) return;
    mutateAddOrRemoveProductToOrder({ productId: id, orderId, sessionId, choices });
  };

  const handleRemoveProduct = (choices: Choice[]) => {
    if (!orderId || !sessionId) return;
    mutateAddOrRemoveProductToOrder({ remove: true, productId: id, orderId, sessionId, choices });
  };

  const linkOrButton = (children: ReactElement) =>
    choiceGroups.length > 0 ? (
      <Link
        href={`${Route.CUSTOMIZE_PRODUCT}${id}`}
        className={`relative flex max-w-full gap-3 ${imageSrc ? "" : "py-3"}`}
      >
        {children}
      </Link>
    ) : (
      <button
        onClick={() => handleAddProduct([])}
        className={`relative flex max-w-full gap-3 ${imageSrc ? "" : "py-3"}`}
      >
        {children}
      </button>
    );

  return (
    <div className="relative flex max-w-full flex-col gap-3 rounded-lg bg-white p-3 shadow-sm">
      {linkOrButton(
        <>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`Fotografía del producto: ${name}`}
              className="aspect-square h-fit w-1/4 rounded-md object-cover"
              width="256"
              height="256"
            />
          )}

          <h3 className="grow text-base font-medium tracking-wide">{name}</h3>

          <p className="min-w-fit text-base font-medium tracking-wide text-lgp-orange-dark">{price} €</p>
        </>
      )}

      {orderProducts &&
        orderProducts.map(({ id, amount, choices }) => (
          <div key={id} className="flex items-center gap-3 rounded-lg border border-opacity-10 bg-slate-100 p-2">
            <div className="flex grow flex-col gap-1">
              <p className="text-sm font-medium tracking-wide">{name}</p>

              <p className="text-xs font-normal tracking-wide">
                {choices.map(({ label }, i) => `${i === 0 ? "" : ", "}${label}`)}
              </p>
            </div>

            <button
              onClick={() => handleRemoveProduct(choices)}
              className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white"
            >
              <RiSubtractLine className="h-6 w-6" />
            </button>

            <p className="w-5 min-w-fit text-center text-base font-medium tracking-wide">{amount}</p>

            <button
              onClick={() => handleAddProduct(choices)}
              className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white"
            >
              <RiAddLine className="h-6 w-6" />
            </button>
          </div>
        ))}

      {isErrorAddOrRemoveProductToOrder && <ErrorMessage message="Hubo un error al modificar el pedido." />}
    </div>
  );
};

export default Product;

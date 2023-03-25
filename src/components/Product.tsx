import { Product, type Choice, type ChoiceGroup, type CustomizedProduct } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import useAddOrRemoveProductToOrder from "~/hooks/api/mutation/useAddOrRemoveProductToOrder";
import { Route } from "~/utils/constant";
import ErrorMessage from "./ErrorMessage";
import OrderedProduct from "./OrderedProduct";

export interface ProductProps {
  product: Product & { choiceGroups: ChoiceGroup[] };
  orderProducts?: (CustomizedProduct & { choices: Choice[] })[];
  orderId?: number;
  sessionId?: string;
}

const Product = ({ product, orderProducts, orderId, sessionId }: ProductProps) => {
  const { id, name, price, imageSrc, choiceGroups } = product;

  const { mutateAddOrRemoveProductToOrder, isLoadingAddOrRemoveProductToOrder, isErrorAddOrRemoveProductToOrder } =
    useAddOrRemoveProductToOrder();

  const handleAddProduct = (productId: number, choices: Choice[]) => {
    if (!orderId || !sessionId) return;
    mutateAddOrRemoveProductToOrder({ productId, orderId, sessionId, choices });
  };

  const handleRemoveProduct = (productId: number, choices: Choice[]) => {
    if (!orderId || !sessionId) return;
    mutateAddOrRemoveProductToOrder({ remove: true, productId, orderId, sessionId, choices });
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
        onClick={() => handleAddProduct(product.id, [])}
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
        orderProducts.map((customizedProduct) => (
          <OrderedProduct
            key={customizedProduct.id}
            customizedProduct={customizedProduct}
            onAddProduct={handleAddProduct}
            disableButtons={isLoadingAddOrRemoveProductToOrder}
            onRemoveProduct={handleRemoveProduct}
          />
        ))}

      {isErrorAddOrRemoveProductToOrder && <ErrorMessage message="Hubo un error al modificar el pedido." />}
    </div>
  );
};

export default Product;

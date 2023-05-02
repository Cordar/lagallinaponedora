import { Product, ProductComponent, ProductOptionGroup } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import { Route } from "~/utils/constant";
import getRandomNumberId from "~/utils/getRandomNumberId";
import OrderedProduct from "./OrderedProduct";
import { StartedOrder } from "~/hooks/useStartedOrder";

export interface ProductProps {
  product: Product & { productComponents: ProductComponent[]; productOptionGroups: ProductOptionGroup[] };
  chosenOrderProducts?: StartedOrder[];
  addProduct: (product: StartedOrder) => void;
  removeProduct: (id: number) => void;
  locales: any;
}

const Product = ({ product, chosenOrderProducts, addProduct, removeProduct, locales }: ProductProps) => {
  const { id, name, price, imageSrc, productComponents, productOptionGroups, internalName } = product;

  const linkOrButton = (children: ReactElement) =>
    productOptionGroups.length > 0 || productComponents.length > 0 ? (
      <Link
        href={`${Route.CUSTOMIZE_PRODUCT}${id}`}
        className={`relative flex max-w-full gap-3 ${imageSrc ? "" : "py-3"}`}
      >
        {children}
      </Link>
    ) : (
      <button
        onClick={() => addProduct({ id: -getRandomNumberId(), amount: 1, productId: id, options: [] })}
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

          <h3 className="grow text-left text-base font-medium tracking-wide">{locales[name]}</h3>

          <p className="min-w-fit text-base font-medium tracking-wide">{price} €</p>
        </>
      )}
      {chosenOrderProducts &&
        chosenOrderProducts.map((orderProduct) => (
          <OrderedProduct
            key={orderProduct.id}
            orderProduct={orderProduct}
            addProduct={addProduct}
            removeProduct={removeProduct}
            locales={locales}
          />
        ))}
    </div>
  );
};

export default Product;

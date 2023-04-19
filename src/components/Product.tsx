import type { Group, Subproduct } from "@prisma/client";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import type { ChosenProductWithSubproducts } from "~/hooks/useStartedOrder";
import { Route } from "~/utils/constant";
import getRandomNumberId from "~/utils/getRandomNumberId";
import OrderedProduct from "./OrderedProduct";

export interface ProductProps {
  product: Product & {
    groups: (Group & {
      subproducts: Subproduct[];
    })[];
  };
  chosenProducts?: ChosenProductWithSubproducts[];
  addProduct: (product: ChosenProductWithSubproducts) => void;
  removeProduct: (id: number) => void;
}

const Product = ({ product, chosenProducts, addProduct, removeProduct }: ProductProps) => {
  const { id, name, price, imageSrc, groups } = product;

  const linkOrButton = (children: ReactElement) =>
    groups.length > 0 ? (
      <Link
        href={`${Route.CUSTOMIZE_PRODUCT}${id}`}
        className={`relative flex max-w-full gap-3 ${imageSrc ? "" : "py-3"}`}
      >
        {children}
      </Link>
    ) : (
      <button
        onClick={() =>
          addProduct({ id: -getRandomNumberId(), amount: 1, productId: id, orderId: null, chosenSubproduct: [] })
        }
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

          <h3 className="grow text-left text-base font-medium tracking-wide">{name}</h3>

          <p className="min-w-fit text-base font-medium tracking-wide">{price} €</p>
        </>
      )}

      {chosenProducts &&
        chosenProducts.map((product) => (
          <OrderedProduct
            key={product.id}
            chosenProduct={product}
            addProduct={addProduct}
            removeProduct={removeProduct}
            showOnlyRemove
          />
        ))}
    </div>
  );
};

export default Product;

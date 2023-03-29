import { Product } from "@prisma/client";
import type { ChosenProduct, Group, ChosenSubproduct, Subproduct } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import { Route } from "~/utils/constant";
import OrderedProduct from "./OrderedProduct";
import type { CreateChosenProductStorage, ChosenProductStorage } from "~/hooks/useStartedOrder";

export interface ProductProps {
  product: Product & {
    groups: (Group & {
        subproducts: Subproduct[];
    })[];
},
  chosenProducts?: ChosenProductStorage[];
  addProduct: (product: CreateChosenProductStorage) => void
}

const Product = ({ product, chosenProducts, addProduct }: ProductProps) => {
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
      <button onClick={() =>addProduct({
        name: name,
        productId: id,
        amount: 1,
        chosenSubproducts: []
      })} className={`relative flex max-w-full gap-3 ${imageSrc ? "" : "py-3"}`}>
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

          <p className="min-w-fit text-base font-medium tracking-wide text-lgp-orange-dark">{price} €</p>
        </>
      )}

      {chosenProducts &&
        chosenProducts.map((product) => (
          <OrderedProduct
            key={product.id}
            chosenProduct={product}
          />
        ))}
    </div>
  );
};

export default Product;

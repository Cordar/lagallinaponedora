import { Product, type Choice, type ChoiceGroup, type CustomizedProduct } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import { Route } from "~/utils/constant";
import getRandomNumberId from "~/utils/getRandomNumberId";
import OrderedProduct from "./OrderedProduct";

export interface ProductProps {
  product: Product & { choiceGroups: ChoiceGroup[] };
  orderProducts?: (CustomizedProduct & { choices: Choice[] })[];
  addProduct: (product: CustomizedProduct & { choices: Choice[] }) => void;
  removeProduct: (product: CustomizedProduct & { choices: Choice[] }) => void;
}

const Product = ({ product, orderProducts, addProduct, removeProduct }: ProductProps) => {
  const { id, name, price, imageSrc, choiceGroups } = product;

  const addProductWithNoChoices = () => {
    addProduct({ id: getRandomNumberId(), productId: id, amount: 1, choices: [] });
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
      <button onClick={addProductWithNoChoices} className={`relative flex max-w-full gap-3 ${imageSrc ? "" : "py-3"}`}>
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

      {orderProducts &&
        orderProducts.map((customizedProduct) => (
          <OrderedProduct
            key={customizedProduct.id}
            customizedProduct={customizedProduct}
            addProduct={addProduct}
            removeProduct={removeProduct}
          />
        ))}
    </div>
  );
};

export default Product;

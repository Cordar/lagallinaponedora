import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export interface ProductProps {
  product: Product;
}

const Product = ({ product }: ProductProps) => {
  const { id, name, price, imageSrc } = product;

  return (
    <Link
      href={`/personalizar-producto/${id}`}
      className={`relative flex max-w-full gap-3 rounded-lg bg-white shadow-sm ${imageSrc ? "p-2" : "p-4 py-5"}`}
    >
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

      <p className="min-w-fit text-base font-medium tracking-wide">{price} €</p>
    </Link>
  );
};

export default Product;

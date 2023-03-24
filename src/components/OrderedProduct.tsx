import { type Choice, type CustomizedProduct } from "@prisma/client";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";
import useProducts from "~/hooks/api/query/useProducts";

export interface OrderedProductProps {
  customizedProduct: CustomizedProduct & { choices: Choice[] };
  onAddProduct: (choices: Choice[]) => void;
  onRemoveProduct: (choices: Choice[]) => void;
  showPrice?: boolean;
}

const OrderedProduct = ({ customizedProduct, onAddProduct, onRemoveProduct, showPrice }: OrderedProductProps) => {
  const { id, amount, choices, productId } = customizedProduct;

  const { products } = useProducts();

  const product = products?.find(({ id }) => id === productId);

  return (
    <div
      key={id}
      className={`flex ${
        showPrice ? "items-start" : "items-center"
      } gap-3 rounded-lg border border-opacity-10 bg-slate-100 p-2`}
    >
      <div className="flex grow flex-col gap-1">
        <p className="text-sm font-medium tracking-wide">{product?.name ?? ""}</p>

        <p className="text-xs font-normal tracking-wide">
          {choices.map(({ label }, i) => `${i === 0 ? "" : ", "}${label}`)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-3">
        {showPrice && (
          <p className="text-sm font-medium tracking-wide text-lgp-orange-dark">
            {product?.price ? `${product?.price * amount} €` : ""}
          </p>
        )}

        <div className="flex grow items-center justify-center gap-3">
          <button
            onClick={() => onRemoveProduct(choices)}
            className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white"
          >
            <RiSubtractLine className="h-6 w-6" />
          </button>

          <p className="w-5 min-w-fit text-center text-base font-medium tracking-wide">{amount}</p>

          <button
            onClick={() => onAddProduct(choices)}
            className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white"
          >
            <RiAddLine className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderedProduct;

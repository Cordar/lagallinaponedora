import { type Choice, type CustomizedProduct } from "@prisma/client";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";
import useProducts from "~/hooks/api/query/useProducts";
import getRandomNumberId from "~/utils/getRandomNumberId";

export interface OrderedProductProps {
  customizedProduct: CustomizedProduct & { choices: Choice[] };
  addProduct?: (product: CustomizedProduct & { choices: Choice[] }) => void;
  removeProduct?: (product: CustomizedProduct & { choices: Choice[] }) => void;
  disableButtons?: boolean;
  showPrice?: boolean;
}

const OrderedProduct = ({
  customizedProduct,
  addProduct,
  removeProduct,
  disableButtons,
  showPrice,
}: OrderedProductProps) => {
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

        {choices.length > 0 && (
          <p className="text-xs font-normal tracking-wide">
            {choices.map(({ label }, i) => `${i === 0 ? "" : ", "}${label}`)}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-3">
        {showPrice && (
          <p className="text-sm font-medium tracking-wide text-lgp-orange-dark">
            {product?.price ? `${product?.price * amount} €` : ""}
          </p>
        )}

        {removeProduct && addProduct && (
          <div className="flex grow items-center justify-center gap-3">
            <button
              type="button"
              disabled={disableButtons}
              onClick={() => removeProduct({ id: getRandomNumberId(), productId, amount: 1, choices })}
              className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white disabled:opacity-70"
            >
              <RiSubtractLine className="h-6 w-6" />
            </button>

            <p className="w-5 min-w-fit text-center text-base font-medium tracking-wide">{amount}</p>

            <button
              type="button"
              disabled={disableButtons}
              onClick={() => addProduct({ id: getRandomNumberId(), productId, amount: 1, choices })}
              className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white disabled:opacity-70"
            >
              <RiAddLine className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderedProduct;

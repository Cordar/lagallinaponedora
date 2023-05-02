import { RiAddLine, RiSubtractLine } from "react-icons/ri";
import useProduct from "~/hooks/api/query/useProduct";
import useProducts from "~/hooks/api/query/useProducts";
import useOptions from "~/hooks/api/query/useSubproducts";
import { StartedOrder } from "~/hooks/useStartedOrder";
import getRandomNumberId from "~/utils/getRandomNumberId";

export interface OrderedProductProps {
  orderProduct: StartedOrder;
  addProduct?: (product: StartedOrder) => void;
  removeProduct?: (id: number) => void;
  disableButtons?: boolean;
  showPrice?: boolean;
  showOnlyRemove?: boolean;
  showProductName?: boolean;
}

const OrderedProduct = ({
  orderProduct,
  addProduct,
  removeProduct,
  disableButtons,
  showPrice,
  showOnlyRemove,
  showProductName,
}: OrderedProductProps) => {
  const { id, amount, productId, options: chosenOptions } = orderProduct;

  const { product } = useProduct(productId);
  const { products } = useProducts();
  const { options } = useOptions();

  return (
    <div
      key={id}
      className={`flex ${
        showPrice ? "items-start" : "items-center"
      } gap-3 rounded-lg border border-opacity-10 bg-slate-100 p-2`}
    >
      <div className="flex grow flex-col gap-1">
        {showProductName && (
          <p className="text-sm font-medium tracking-wide">
            {products?.find(({ id }) => id === productId)?.name ?? ""}
          </p>
        )}

        {chosenOptions.length <= 0 && !showProductName && (
          <p className="text-xs font-normal tracking-wide">
            {products?.find(({ id }) => id === productId)?.name ?? ""}
          </p>
        )}

        {chosenOptions.length > 0 && (
          <p className="text-xs font-normal tracking-wide">
            {chosenOptions.map(
              ({ optionId }, i) => `${i === 0 ? "" : ", "}${options?.find(({ id }) => id === optionId)?.name ?? ""}`
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-3">
        {showPrice && (
          <p className="text-sm font-medium tracking-wide">{product?.price ? `${product?.price * amount} €` : ""}</p>
        )}

        <div className="flex grow items-center justify-center gap-3">
          {!showOnlyRemove && removeProduct && (
            <button
              type="button"
              disabled={disableButtons}
              onClick={() => removeProduct(id)}
              className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white disabled:opacity-70"
            >
              <RiSubtractLine className="h-6 w-6" />
            </button>
          )}

          <p className="w-5 min-w-fit text-center text-base font-medium tracking-wide">{amount}</p>

          {showOnlyRemove && removeProduct && (
            <button
              type="button"
              disabled={disableButtons}
              onClick={() => removeProduct(id)}
              className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-slate-500 text-white disabled:opacity-70"
            >
              <RiSubtractLine className="h-6 w-6" />
            </button>
          )}

          {!showOnlyRemove && addProduct && (
            <button
              type="button"
              disabled={disableButtons}
              onClick={() =>
                addProduct({
                  id: -getRandomNumberId(),
                  amount: 1,
                  productId,
                  options: [...chosenOptions],
                })
              }
              className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-lgp-green text-white disabled:opacity-70"
            >
              <RiAddLine className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderedProduct;

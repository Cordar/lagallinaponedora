import { ProductCategory } from "@prisma/client";
import { type GetServerSideProps, type NextPage } from "next";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import Product from "~/components/Product";
import useCurrentOrder from "~/hooks/api/query/useCurrentOrder";
import useProducts from "~/hooks/api/query/useProducts";
import useUser from "~/hooks/api/query/useUser";
import { Cookie } from "~/utils/constant";
import { default as getLayout } from "~/utils/getLayout";
import { type PageProps } from "./_app";

const ProductCategoryMap: Record<ProductCategory, string> = {
  COMBO: "Combos",
  DISH: "Platos",
  DESSERT: "Postres",
  DRINK: "Bebidas",
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const sessionCookie = req.cookies[Cookie.SESSION];
  const props: PageProps = { sessionId: sessionCookie ?? null };
  return { props };
};

const Home: NextPage<PageProps> = ({ sessionId }) => {
  const Layout = getLayout("La Gallina Ponedora | Productos", "Haz un pedido de los productos presentados.");

  const { user, isErrorUser } = useUser(sessionId);
  const { products, isLoadingProducts, isErrorProducts } = useProducts();
  const { order, isErrorOrder } = useCurrentOrder(user?.sessionId);

  if (isLoadingProducts) return Layout(<Loading />);

  if (isErrorProducts || isErrorUser || isErrorOrder)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message="No se ha podido cargar la página" />
      </div>
    );

  const buttonInfo = order?.customizedProducts.reduce(
    ({ totalPrice, totalNumberOfItems }, { amount, productId }) => ({
      totalNumberOfItems: totalNumberOfItems + amount,
      totalPrice: totalPrice + amount * (products?.find(({ id }) => id === productId)?.price ?? 0),
    }),
    { totalPrice: 0, totalNumberOfItems: 0 }
  );

  return Layout(
    <>
      <div className="relative flex flex-col items-center gap-5 bg-gradient-to-b from-lgp-gradient-orange-dark to-lgp-gradient-orange-light px-5 py-10">
        <h1 className="text-ellipsis text-xl font-bold tracking-wide">La Gallina Ponedora</h1>
      </div>

      <div className="relative flex grow flex-col gap-5 bg-lgp-orange-light p-5">
        <div className="mb-20 flex flex-col gap-6">
          {[ProductCategory.COMBO, ProductCategory.DISH, ProductCategory.DESSERT, ProductCategory.DRINK].map(
            (category) => (
              <div key={category} className="flex max-w-full flex-col gap-2">
                <h2 className="text-ellipsis text-lg font-semibold tracking-wide">{ProductCategoryMap[category]}</h2>

                {products &&
                  products
                    .filter((product) => product.category === category)
                    .map((product) => (
                      <Product
                        key={product.id}
                        product={product}
                        orderProducts={order?.customizedProducts.filter(({ productId }) => productId === product.id)}
                        sessionId={user?.sessionId}
                        orderId={order?.id}
                      />
                    ))}
              </div>
            )
          )}
        </div>

        {/* TODO make this button do something */}
        {order && buttonInfo && order.customizedProducts.length > 0 && (
          <Button
            label={`Pide ${buttonInfo.totalNumberOfItems} por ${buttonInfo.totalPrice} €`}
            className="fixed left-5 right-5 bottom-5 m-auto w-[unset] max-w-md"
          />
        )}
      </div>
    </>
  );
};

export default Home;

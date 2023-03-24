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
    return Layout(<ErrorMessage message="No se ha podido cargar la página" />);

  return Layout(
    <>
      <h1 className="text-ellipsis text-2xl font-bold tracking-wide">La Gallina Ponedora</h1>

      <div className="mb-28 flex flex-col gap-6">
        {[ProductCategory.COMBO, ProductCategory.DISH, ProductCategory.DESSERT, ProductCategory.DRINK].map(
          (category) => (
            <div key={category} className="flex max-w-full flex-col gap-2">
              <h2 className="text-ellipsis text-xl font-semibold tracking-wide">{ProductCategoryMap[category]}</h2>

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
      <Button label="Pide 2 por 24 €" className="fixed left-5 right-5 bottom-5 w-[unset]" />
    </>
  );
};

export default Home;

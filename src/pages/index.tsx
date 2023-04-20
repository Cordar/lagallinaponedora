import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import SVG from "react-inlinesvg";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import Product from "~/components/Product";
import useAreOrdersInProgress from "~/hooks/api/query/useAreOrdersInProgress";
import useProductCategories from "~/hooks/api/query/useProductCategories";
import useProducts from "~/hooks/api/query/useProducts";
import useUser from "~/hooks/api/query/useUser";
import useStartedOrder from "~/hooks/useStartedOrder";
import { createContextInner } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import { default as getLayout } from "~/utils/getLayout";
import { NextPageWithLayout } from "./_app";

export const getStaticProps: any = async (context: GetStaticPropsContext) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  await ssg.public.getProductCategories.prefetch();
  return { props: { trpcState: ssg.dehydrate() }, revalidate: ONE_HOUR_MS / 1000 };
};

const HomePage: NextPageWithLayout = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { push } = useRouter();
  const Layout = getLayout("La Gallina Ponedora | Productos", "Haz un pedido de los productos presentados.");

  const { productCategories, isLoadingProductCategories, isErrorProductCategories } = useProductCategories();
  const { products, isLoadingProducts, isErrorProducts } = useProducts();
  const { user, isErrorUser } = useUser();
  const { startedOrder, addProduct, removeProduct } = useStartedOrder();
  const { areOrdersInProgress } = useAreOrdersInProgress(user?.sessionId);

  function ShowLoginIfUserIsNotLoggedIn() {
    if (user.id == -1) {
      return (
        <Link href={Route.LOGIN} className="m-auto mb-0 mt-5">
          <p className="rounded-lg bg-lgp-green px-3 py-2 text-sm text-white">¿Ya has pedido? Accede aquí</p>
        </Link>
      );
    }
    return <></>;
  }

  if (isLoadingProducts || isLoadingProductCategories) return Layout(<Loading />);

  if (isErrorProducts || isErrorUser)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message="No se ha podido cargar la página" />
      </div>
    );

  const buttonInfo = startedOrder.reduce(
    ({ totalPrice, totalNumberOfItems }, { amount, productId }) => ({
      totalNumberOfItems: totalNumberOfItems + amount,
      totalPrice: totalPrice + amount * (products?.find(({ id }) => id === productId)?.price ?? 0),
    }),
    { totalPrice: 0, totalNumberOfItems: 0 }
  );

  const onOrder = () => {
    void push(Route.CHECKOUT);
  };

  return Layout(
    <div className="relative flex grow flex-col gap-5 bg-lgp-background">
      <div className="mb-8 flex h-56 w-full flex-col items-center gap-5 overflow-visible bg-field bg-cover bg-center pt-8">
        <SVG src="/gallina.svg" className="-mb-16 w-3/4" />
      </div>

      <ShowLoginIfUserIsNotLoggedIn></ShowLoginIfUserIsNotLoggedIn>

      <div className="relative flex grow flex-col gap-5 p-5 pt-0">
        <div className="mb-40 flex flex-col gap-6">
          {productCategories &&
            productCategories.map((category) => (
              <div key={category.id} className="flex max-w-full flex-col gap-2">
                <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{category.name}</h3>
                {category.products &&
                  category.products.map((product) => (
                    <Product
                      key={product.id}
                      product={product}
                      chosenProducts={startedOrder.filter(({ productId }) => productId === product.id)}
                      addProduct={addProduct}
                      removeProduct={removeProduct}
                    />
                  ))}
              </div>
            ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0">
          {startedOrder && buttonInfo && startedOrder.length > 0 && (
            <div className="flex w-full justify-center p-5">
              <Button
                onClick={onOrder}
                label={`Pide ${buttonInfo.totalNumberOfItems} por ${buttonInfo.totalPrice} €`}
                className="w-full lg:max-w-md"
              />
            </div>
          )}

          {areOrdersInProgress && (areOrdersInProgress.readyOrders || areOrdersInProgress.cookingOrders) && (
            <div className="bg-slate-50 shadow-[0_0_1rem_rgb(0,0,0,0.5)]">
              <div className="m-auto flex items-center justify-center gap-4 p-5 lg:max-w-md">
                {areOrdersInProgress.readyOrders ? (
                  <Image
                    src="/waiting.gif"
                    className="h-10 w-10 mix-blend-darken"
                    alt="animación de un plato siendo revelado"
                    width={256}
                    height={256}
                    priority
                  />
                ) : (
                  <Image
                    src="/cooking.gif"
                    className="h-10 w-10 mix-blend-darken"
                    alt="animación de una olla cocinando"
                    width={256}
                    height={256}
                    priority
                  />
                )}

                <h3 className="grow text-ellipsis text-sm font-semibold tracking-wide">
                  {areOrdersInProgress.readyOrders ? "¡Tu pedido está listo!" : "¡Estamos preparando tu pedido!"}
                </h3>

                <Link href={Route.ORDER_STATUS}>
                  <p className="text-ellipsis rounded-full bg-lgp-green px-4 py-2 text-sm font-medium tracking-wide text-white">
                    Ver
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

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
import useUser from "~/hooks/api/query/useUser";
import useStartedOrder from "~/hooks/useStartedOrder";
import { createContextInner } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import getLocale from "~/utils/locale/getLocale";
import getLocaleObject from "~/utils/locale/getLocaleObject";
import { NextPageWithLayout } from "./_app";
import useOptions from "~/hooks/api/query/useSubproducts";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  await ssg.public.getProductCategories.prefetch();
  await ssg.public.getOptions.prefetch();
  await ssg.public.getProducts.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      locale: getLocale(context.locale),
    },
    revalidate: ONE_HOUR_MS / 1000,
  };
};

const Index: NextPageWithLayout = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { push } = useRouter();
  const locales = getLocaleObject(props.locale);
  const Layout = getLayout(locales.home.title, locales.home.description);
  const { startedOrder, addProduct, removeProduct } = useStartedOrder();

  const { productCategories, isLoadingProductCategories, isErrorProductCategories } = useProductCategories();
  const { options } = useOptions();
  const { user, isErrorUser } = useUser();
  const products = productCategories?.flatMap((category) => {
    return category.products;
  });
  const { areOrdersInProgress } = useAreOrdersInProgress(user?.sessionId);

  function ShowLoginIfUserIsNotLoggedIn() {
    if (user.id == -1) {
      return (
        <Link href={Route.LOGIN} className="m-auto mb-0">
          <p className="rounded-lg bg-lgp-green px-3 py-2 text-sm text-white">{locales.home.login}</p>
        </Link>
      );
    }
    return <></>;
  }

  if (isLoadingProductCategories) return Layout(<Loading />);

  if (isErrorProductCategories || isErrorUser)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message={locales.pageLoadError} />
      </div>
    );

  const buttonInfo = startedOrder.reduce(
    ({ totalPrice, totalNumberOfItems }, { amount, productId, options: startedOrderOptions }) => ({
      totalNumberOfItems: totalNumberOfItems + amount,
      totalPrice:
        totalPrice +
        amount *
          (products != null && options != null
            ? products?.find(({ id }) => id === productId)?.price +
              startedOrderOptions.reduce(
                (accumulator, option) => accumulator + options.find(({ id }) => id == option.optionId)?.price ?? 0,
                0
              )
            : 0),
    }),
    { totalPrice: 0, totalNumberOfItems: 0 }
  );

  const onOrder = () => {
    void push(Route.CHECKOUT);
  };

  return Layout(
    <div className="relative flex grow flex-col gap-5 bg-lgp-background">
      <div className="mb-20 flex h-56 w-full flex-col items-center gap-5 overflow-visible bg-field bg-cover bg-center pt-8">
        <SVG src="/gallina.svg" className="-mb-16 w-3/4" />
      </div>

      <ShowLoginIfUserIsNotLoggedIn></ShowLoginIfUserIsNotLoggedIn>

      <div className="relative flex grow flex-col gap-5 p-5 pt-0">
        <div className="mb-40 flex flex-col gap-6">
          {productCategories &&
            productCategories.map((category) => (
              <div key={category.id} className="flex max-w-full flex-col gap-2">
                <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{locales[category.name]}</h3>

                {category.products &&
                  category.products.map((product) => (
                    <Product
                      key={product.id}
                      product={product}
                      chosenOrderProducts={startedOrder.filter(({ productId }) => productId === product.id)}
                      addProduct={addProduct}
                      removeProduct={removeProduct}
                      locales={locales}
                    />
                  ))}
              </div>
            ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        {startedOrder && buttonInfo && startedOrder.length > 0 && (
          <div className="flex w-full justify-center p-5">
            <Button
              onClick={onOrder}
              label={`${locales.home.button1} ${buttonInfo.totalNumberOfItems} ${locales.home.button2} ${buttonInfo.totalPrice} €`}
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
                {areOrdersInProgress.readyOrders ? locales.home.pedidoListo : locales.home.pedidoEnProceso}
              </h3>

              <Link href={Route.ORDER_STATUS}>
                <p className="text-ellipsis rounded-full bg-lgp-green px-4 py-2 text-sm font-medium tracking-wide text-white">
                  {locales.home.see}
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

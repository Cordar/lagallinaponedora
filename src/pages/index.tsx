import { ProductCategory } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { type ReactElement } from "react";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import Product from "~/components/Product";
import { api } from "~/utils/api";

const ProductCategoryMap: Record<ProductCategory, string> = {
  COMBO: "Combos",
  DISH: "Platos",
  DESSERT: "Postres",
  DRINK: "Bebidas",
};

const Home: NextPage = () => {
  const { data: products, isLoading, isError, error } = api.public.getProducts.useQuery();

  // TODO Separate into a layuot component that recieves the title and description and returns a function that given a children returns the layout
  const container = (children: ReactElement) => (
    <>
      <Head>
        <title>La Gallina Ponedora | Productos</title>
        <meta name="description" content="Haz un pedido de los productos presentados." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative flex min-h-screen flex-col gap-6 bg-slate-200 p-5">{children}</main>
    </>
  );

  if (isLoading) return container(<Loading />);
  else if (isError || !products) return container(<ErrorMessage message={error.message} />);

  return container(
    <>
      <h1 className="text-ellipsis text-2xl font-bold tracking-wide">La Gallina Ponedora</h1>

      <div className="mb-28 flex flex-col gap-6">
        {[ProductCategory.COMBO, ProductCategory.DISH, ProductCategory.DESSERT, ProductCategory.DRINK].map(
          (category) => (
            <div key={category} className="flex max-w-full flex-col gap-2">
              <h2 className="text-ellipsis text-xl font-semibold tracking-wide">{ProductCategoryMap[category]}</h2>

              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <Product key={product.id} product={product} />
                ))}
            </div>
          )
        )}
      </div>

      <Button label="Pide 2 por 24 €" className="fixed left-5 right-5 bottom-5 w-[unset]" />
    </>
  );
};

export default Home;

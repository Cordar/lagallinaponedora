import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RiArrowLeftLine } from "react-icons/ri";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import RadioGroup from "~/components/RadioGroup";
import useProduct from "~/hooks/api/query/useProduct";
import useProducts from "~/hooks/api/query/useProducts";
import { default as useUser } from "~/hooks/api/query/useUser";
import useStartedOrder from "~/hooks/useStartedOrder";
import { createContextInner } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import getRandomNumberId from "~/utils/getRandomNumberId";
import { type NextPageWithLayout } from "../_app";
import { Option, OptionGroup, ProductOptionGroup } from "@prisma/client";
import getLocaleObject from "~/utils/locale/getLocaleObject";
import getLocale from "~/utils/locale/getLocale";

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  const products = await ssg.public.getProducts.fetch();
  const paths =
    products?.flatMap((product) => {
      return !locales
        ? { locale: "es", params: { productId: product.id.toString() } }
        : locales.map((locale) => ({ locale, params: { productId: product.id.toString() } }));
    }) ?? [];
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  await ssg.public.getProducts.prefetch();
  if (params?.productId) await ssg.public.getProductById.prefetch({ productId: parseInt(params.productId as string) });
  return { props: { trpcState: ssg.dehydrate(), locale: getLocale(locale) }, revalidate: ONE_HOUR_MS / 1000 };
};

type FormData = Record<string, string>;

const CustomizeProduct: NextPageWithLayout = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const locales = getLocaleObject(props.locale);
  const { query, push } = useRouter();
  const Layout = getLayout(locales.personalizarProducto.title, locales.personalizarProducto.description);

  const productId = query.productId ? parseInt(query.productId as string) : undefined;

  const { products } = useProducts();
  const { product, isErrorProduct } = useProduct(productId);
  const { user, isLoadingUser, isErrorUser } = useUser();
  const { startedOrder, addProduct } = useStartedOrder();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const getFormError = (name: keyof FormData) => errors[name] && errors[name]?.message;

  const [allInputsFilled, setAllInputsFilled] = useState(false);
  const watchAllFields = watch();

  let optionGroups: (ProductOptionGroup & { optionGroup: OptionGroup & { options: Option[] } })[] = [];
  useEffect(() => {
    const isFilled =
      (optionGroups &&
        optionGroups.every(({ optionGroup }) => {
          const value = getValues(optionGroup.id.toString());
          return value && optionGroup.options.some((option) => option.id.toString() === value);
        })) ??
      false;

    setAllInputsFilled(isFilled);
  }, [getValues, optionGroups, watchAllFields]);

  if (!product || !products) return Layout(<Loading />);
  else if (isErrorUser || isErrorProduct) return Layout(<ErrorMessage message={locales.pageLoadError} />);

  product.productOptionGroups.forEach((optionGroup) => {
    optionGroups.push(optionGroup);
  });
  for (let i = 0; i < product.productComponents.length; i++) {
    const productComponent = product.productComponents[i];
    if (!productComponent) {
      continue;
    }
    let childProduct = products.find((product) => product.id == productComponent.childId);
    if (childProduct?.id) {
      childProduct.productOptionGroups.forEach((optionGroup) => {
        optionGroups.push(optionGroup);
      });
    }
  }

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    if (!startedOrder || !user || !product) return;

    const randomId = -getRandomNumberId();

    addProduct({
      id: randomId,
      amount: 1,
      productId: product.id,
      options: Object.entries(data).map(([key, value]) => ({
        id: -getRandomNumberId(),
        optionGroupId: parseInt(key),
        optionId: parseInt(value),
      })),
    });

    void push(Route.HOME);
  };

  return Layout(
    <div className="relative flex grow flex-col gap-5 bg-lgp-background p-5">
      <Link href={Route.HOME} className="w-fit">
        <RiArrowLeftLine className="h-8 w-8" />
      </Link>

      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full grow flex-col gap-8">
        <div className="relative flex w-full flex-col gap-2">
          {product.imageSrc && (
            <Image
              src={product.imageSrc}
              alt={`Fotografía del producto: ${product.name}`}
              className="w-fill m-auto h-40 rounded-md object-cover"
              width="512"
              height="512"
            />
          )}

          <div className="relative flex w-full gap-2 rounded-md ">
            <h3 className="grow text-lg font-semibold tracking-wide">{locales[product.name]}</h3>
            <p className="min-w-fit text-lg font-semibold tracking-wide">{product.price} €</p>
          </div>
        </div>

        <div className="mb-20 flex flex-col gap-5">
          {optionGroups ? (
            optionGroups.map(({ optionGroup }) => (
              <RadioGroup
                key={optionGroup.id}
                title={locales[optionGroup.title]}
                buttons={optionGroup.options.map(({ id, name }) => ({
                  id: id.toString(),
                  name: locales[name],
                }))}
                register={register(optionGroup.id.toString())}
                error={getFormError(optionGroup.id.toString())}
              />
            ))
          ) : (
            <Loading />
          )}
        </div>

        <Button
          isDisabled={!allInputsFilled || isLoadingUser}
          label={locales.add}
          className="fixed bottom-5 left-5 right-5 m-auto w-[unset] lg:max-w-md"
        />
      </form>
    </div>
  );
};

export default CustomizeProduct;

import { type GetStaticProps, type NextPage } from "next";
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
import useAddOrRemoveProductToOrder from "~/hooks/api/mutation/useAddOrRemoveProductToOrder";
import useProduct from "~/hooks/api/query/useProduct";
import useProducts from "~/hooks/api/query/useProducts";
import useStartedOrder from "~/hooks/api/query/useStartedOrder";
import { default as useUser } from "~/hooks/api/query/useUser";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "../_app";

export const getStaticPaths = async () => {
  const ssg = getTrpcSSGHelpers();
  const products = await ssg.public.getProducts.fetch();
  const paths = products?.map((product) => ({ params: { productId: product.id.toString() } })) ?? [];
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssg = getTrpcSSGHelpers();
  await ssg.public.getProducts.prefetch();
  if (params?.productId)
    await ssg.public.getProductWithChoiceGroups.prefetch({ productId: parseInt(params.productId as string) });
  return { props: { trpcState: ssg.dehydrate() }, revalidate: ONE_HOUR_MS / 1000 };
};

type FormData = Record<string, string>;

const CustomizeProduct: NextPage<PageProps> = () => {
  const { query, push } = useRouter();
  const Layout = getLayout("La Gallina Ponedora | Personalizar producto", "Personaliza este producto a tu gusto.");

  const productId = query.productId ? parseInt(query.productId as string) : undefined;

  const { products } = useProducts();
  const { product, isErrorProduct } = useProduct(productId);
  const { user, isLoadingUser, isErrorUser } = useUser();
  const { startedOrder, isErrorStartedOrder } = useStartedOrder(user?.sessionId);

  const { mutateAddOrRemoveProductToOrder, isLoadingAddOrRemoveProductToOrder, isErrorAddOrRemoveProductToOrder } =
    useAddOrRemoveProductToOrder();

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

  useEffect(() => {
    const isFilled =
      (product?.choiceGroups &&
        product.choiceGroups.every(({ id, choices }) => {
          const value = getValues(id.toString());
          return value && choices.some((choice) => choice.id.toString() === value);
        })) ??
      false;

    setAllInputsFilled(isFilled);
  }, [getValues, product, watchAllFields]);

  const productInfo = products?.find((product) => product.id === productId);

  if (!productInfo) return Layout(<Loading />);
  else if (isErrorProduct || isErrorUser || isErrorStartedOrder)
    return Layout(<ErrorMessage message="No se ha podido cargar la página" />);

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    if (!startedOrder || !user || !product) return;
    const choicesIds = new Set(Object.values(data).map((choice) => parseInt(choice)));
    const choices = product.choiceGroups.flatMap(({ choices, id }) =>
      choices
        .filter((choice) => choicesIds.has(choice.id))
        .map((choice) => ({ id: choice.id, label: choice.label, choiceGroupId: id }))
    );

    mutateAddOrRemoveProductToOrder({
      sessionId: user.sessionId,
      orderId: startedOrder.id,
      productId: product.id,
      choices,
    });
    void push(Route.HOME);
  };

  const { name, price, imageSrc } = productInfo;

  return Layout(
    <div className="relative flex grow flex-col gap-5 bg-lgp-orange-light p-5">
      <Link href={Route.HOME} className="w-fit">
        <RiArrowLeftLine className="h-8 w-8" />
      </Link>

      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full grow flex-col gap-8">
        <div className="relative flex w-full flex-col gap-2">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`Fotografía del producto: ${name}`}
              className="w-fill m-auto h-40 rounded-md object-cover"
              width="512"
              height="512"
            />
          )}

          <div className="relative flex w-full gap-2 rounded-md bg-lgp-gradient-orange-light py-2 px-4">
            <h3 className="grow text-lg font-semibold tracking-wide">{name}</h3>
            <p className="min-w-fit text-lg font-semibold tracking-wide">{price} €</p>
          </div>

          {isErrorAddOrRemoveProductToOrder && <ErrorMessage message="No se ha podido añadir el producto." />}
        </div>

        <div className="mb-20 flex flex-col gap-5">
          {product ? (
            product.choiceGroups.map(({ id, title, choices }) => (
              <RadioGroup
                key={id}
                title={title}
                buttons={choices.map(({ id, label }) => ({
                  id: id.toString(),
                  label,
                }))}
                register={register(id.toString())}
                error={getFormError(id.toString())}
              />
            ))
          ) : (
            <Loading />
          )}
        </div>

        <Button
          isDisabled={!allInputsFilled || isLoadingUser}
          isLoading={isLoadingAddOrRemoveProductToOrder}
          label="Añadir"
          className="fixed left-5 right-5 bottom-5 w-[unset]"
        />
      </form>
    </div>
  );
};

export default CustomizeProduct;

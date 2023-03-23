import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import RadioGroup from "~/components/RadioGroup";
import { api } from "~/utils/api";
import { Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";

type FormData = Record<string, string>;

const CustomizeProduct: NextPage = () => {
  const Layout = getLayout("La Gallina Ponedora | Personalizar producto", "Personaliza este producto a tu gusto.");

  const { query, push } = useRouter();
  const { productId } = query;

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = api.public.getProductWithChoiceGroups.useQuery(
    { productId: parseInt(productId as string) },
    { enabled: !!productId }
  );

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const onFormSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data); // TODO use this data

    await push(Route.HOME);
  };

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

  if (isLoading) return Layout(<Loading />);
  else if (isError || !product.choiceGroups) return Layout(<ErrorMessage message={error?.message} />);

  const { name, price, imageSrc } = product;

  return Layout(
    <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full grow flex-col gap-8">
      <div className="relative flex w-full flex-col gap-2">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={`Fotografía del producto: ${name}`}
            className="w-fill h-40 rounded-md object-cover"
            width="512"
            height="512"
          />
        )}
        <div className="relative flex w-full gap-2">
          <h3 className="grow text-lg font-semibold tracking-wide">{name}</h3>
          <p className="min-w-fit text-lg font-semibold tracking-wide">{price} €</p>
        </div>
      </div>

      <div className="mb-28 flex flex-col gap-8">
        {product.choiceGroups.map(({ id, title, choices }) => (
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
        ))}
      </div>

      <Button
        isDisabled={!allInputsFilled}
        isLoading={isLoading}
        label="Añadir"
        className="fixed left-5 right-5 bottom-5 w-[unset]"
      />
    </form>
  );
};

export default CustomizeProduct;

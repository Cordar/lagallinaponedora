import { type Choice } from "@prisma/client";
import { type GetServerSideProps, type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RiArrowLeftLine } from "react-icons/ri";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Input from "~/components/Input";
import Loading from "~/components/Loading";
import OrderedProduct from "~/components/OrderedProduct";
import useAddOrRemoveProductToOrder from "~/hooks/api/mutation/useAddOrRemoveProductToOrder";
import useUpdateCustomerInfo from "~/hooks/api/mutation/useUpdateCustomerInfo";
import useCurrentOrder from "~/hooks/api/query/useCurrentOrder";
import useProducts from "~/hooks/api/query/useProducts";
import useUser from "~/hooks/api/query/useUser";
import { Cookie, EMAIL_REGEX, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { type PageProps } from "./_app";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const sessionCookie = req.cookies[Cookie.SESSION];
  const props: PageProps = { sessionId: sessionCookie ?? null };
  return { props };
};

interface Inputs {
  email: string;
  name: string;
}

const Home: NextPage<PageProps> = ({ sessionId }) => {
  const { push } = useRouter();
  const Layout = getLayout("La Gallina Ponedora | Tu Pedido", "Revisa tu pedido y mándalo a cocina.");

  const { user, isErrorUser } = useUser(sessionId);
  const { products, isLoadingProducts, isErrorProducts } = useProducts();
  const { order, isLoadingOrder, isErrorOrder } = useCurrentOrder(user?.sessionId);

  const { mutateUpdateCustomerInfo, isLoadingUpdateCustomerInfo, isErrorUpdateCustomerInfo } = useUpdateCustomerInfo();

  useEffect(() => {
    if (order && order.customizedProducts.length <= 0) void push(Route.HOME);
  }, [order, push]);

  const { mutateAddOrRemoveProductToOrder, isLoadingAddOrRemoveProductToOrder, isErrorAddOrRemoveProductToOrder } =
    useAddOrRemoveProductToOrder();

  const handleAddProduct = (productId: number, choices: Choice[]) => {
    if (!order || !sessionId) return;
    mutateAddOrRemoveProductToOrder({ productId, orderId: order.id, sessionId, choices });
  };

  const handleRemoveProduct = (productId: number, choices: Choice[]) => {
    if (!order || !sessionId) return;
    mutateAddOrRemoveProductToOrder({ remove: true, productId, orderId: order.id, sessionId, choices });
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (user && user.email && user.name) {
      setValue("email", user.email);
      setValue("name", user.name);
    }
  }, [setValue, user]);

  const getFormError = (name: keyof Inputs) => errors[name] && errors[name]?.message;

  const [updateData, setUpdateData] = useState(false);

  if (isLoadingProducts || isLoadingOrder) return Layout(<Loading />);

  if (isErrorProducts || isErrorUser || isErrorOrder)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message="No se ha podido cargar la página" />
      </div>
    );

  const onFormSubmit: SubmitHandler<Inputs> = ({ email, name }) => {
    if (sessionId && email && name) {
      mutateUpdateCustomerInfo({ sessionId, email, name });

      // TODO redirect to payment
    }
  };

  const totalPrice = order?.customizedProducts.reduce(
    (prev, { amount, productId }) => prev + amount * (products?.find(({ id }) => id === productId)?.price ?? 0),
    0
  );

  const watchEmail = watch("email");
  const watchName = watch("name");

  return Layout(
    <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex grow flex-col gap-5 bg-lgp-orange-light p-5">
      <div className="flex w-full items-center gap-3">
        <Link href={Route.HOME} className="w-fit">
          <RiArrowLeftLine className="h-8 w-8" />
        </Link>
      </div>

      {order?.customizedProducts && (
        <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
          <h3 className="text-ellipsis text-lg font-semibold tracking-wide">Tu pedido</h3>

          {order.customizedProducts
            .sort((a, b) => b.id - a.id)
            .map((customizedProduct) => (
              <OrderedProduct
                key={customizedProduct.id}
                customizedProduct={customizedProduct}
                onAddProduct={handleAddProduct}
                disableButtons={isLoadingAddOrRemoveProductToOrder}
                onRemoveProduct={handleRemoveProduct}
              />
            ))}

          {totalPrice && (
            <div className="flex items-center justify-end">
              <h3 className="text-ellipsis text-lg font-semibold tracking-wide text-lgp-orange-dark">{`Total ${totalPrice} €`}</h3>
            </div>
          )}

          {isErrorAddOrRemoveProductToOrder && <ErrorMessage message="No se ha podido modificar el pedido." />}
        </div>
      )}

      <div className="mb-20 flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
        {updateData || !user?.email || !user?.name ? (
          <>
            <h3 className="text-ellipsis text-lg font-semibold tracking-wide">Dinos quién eres:</h3>

            <div className="relative flex w-full grow flex-col gap-5">
              <Input
                id={"email"}
                label={"Email"}
                register={register("email", {
                  required: { value: true, message: "Este campo es obligatorio" },
                  pattern: { value: EMAIL_REGEX, message: "El email no es válido" },
                })}
                errorMessage={getFormError("email")}
              />

              <Input
                id={"name"}
                label={"Nombre"}
                register={register("name", {
                  required: { value: true, message: "Este campo es obligatorio" },
                  maxLength: { value: 16, message: "El nombre no es demasiado largo" },
                  minLength: { value: 2, message: "El nombre no es demasiado corto" },
                })}
                errorMessage={getFormError("name")}
              />

              <small className="text-slate-400">
                Solo usaremos tu email para avisarte de que tu pedido está listo. También te llamaremos por tu nombre.
              </small>

              {isErrorUpdateCustomerInfo && <ErrorMessage message="Hubo un error al guardar tus datos." />}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{`Bienvenido de nuevo ${user.name}`}</h3>

            <p className="text-sm font-medium tracking-wide">{`Tu email: ${user.email}`}</p>

            <small className="text-slate-400">
              Te avisaremos por email cuando tu pedido esté listo y te llamaremos por tu nombre
            </small>

            <button
              onClick={() => setUpdateData(true)}
              type="button"
              className="tracking-wid p-2 font-medium text-slate-500"
            >
              Cambiar tus datos
            </button>
          </>
        )}
      </div>

      <Button
        isDisabled={!watchEmail || watchEmail.length <= 0 || !watchName || watchName.length <= 0}
        isLoading={isLoadingUpdateCustomerInfo}
        label="Pagar"
        className="fixed left-5 right-5 bottom-5 w-[unset]"
      />
    </form>
  );
};

export default Home;

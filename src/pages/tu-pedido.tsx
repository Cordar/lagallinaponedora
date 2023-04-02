import { type GetStaticProps, type NextPage } from "next";
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
import useRegisterOrder from "~/hooks/api/mutation/useRegisterOrder";
import useUpdateCustomerInfo from "~/hooks/api/mutation/useUpdateCustomerInfo";
import useProducts from "~/hooks/api/query/useProducts";
import useUser from "~/hooks/api/query/useUser";
import useStartedOrder from "~/hooks/useStartedOrder";
import { EMAIL_REGEX, ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "./_app";

import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

export const getStaticProps: GetStaticProps = async () => {
  const ssg = getTrpcSSGHelpers();
  await ssg.public.getProducts.prefetch();
  await ssg.public.getSubproducts.prefetch();
  return { props: { trpcState: ssg.dehydrate() }, revalidate: ONE_HOUR_MS / 1000 };
};

interface Inputs {
  email: string;
  name: string;
}

const YourOrder: NextPage<PageProps> = () => {
  const { push } = useRouter();
  const Layout = getLayout("La Gallina Ponedora | Tu Pedido", "Revisa tu pedido y mándalo a cocina.");

  // Pagos
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log("Order canceled -- continue to shop around and checkout when you’re ready.");
    }
  }, []);

  const createCheckOutSession = async (order: Order) => {
    const stripe = await stripePromise;
    if (!stripe) {
      return;
    }
    const checkoutSession = await axios.post("/api/checkout_sessions", {
      order: order,
    });
    if (!checkoutSession || !checkoutSession.data) {
      return;
    }
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) {
      alert(result.error.message);
    }
  };

  const { products, isLoadingProducts, isErrorProducts } = useProducts();
  const { user, isErrorUser } = useUser();
  const { startedOrder, addProduct, removeProduct } = useStartedOrder();

  const { mutateUpdateCustomerInfo, isLoadingUpdateCustomerInfo, isErrorUpdateCustomerInfo } = useUpdateCustomerInfo();
  const { mutateRegisterOrder, isLoadingRegisterOrder, isErrorRegisterOrder } = useRegisterOrder();

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

  if (isLoadingProducts) return Layout(<Loading />);

  if (isErrorProducts || isErrorUser)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message="No se ha podido cargar la página" />
      </div>
    );

  const onFormSubmit: SubmitHandler<Inputs> = ({ email, name }) => {
    if (user?.sessionId && email && name && startedOrder) {
      mutateUpdateCustomerInfo({ sessionId: user.sessionId, email, name });
      mutateRegisterOrder(
        {
          sessionId: user.sessionId,
          chosenProducts: startedOrder.map(({ amount, productId, chosenSubproducts }) => ({
            amount,
            productId,
            chosenSubproducts: chosenSubproducts.map(({ subproductId }) => subproductId),
          })),
        },
        {
          onSuccess: (order) => {
            // TODO Redirect to payment here, the callback should have the order id
            void push(`${Route.ORDER_STATUS}${order.id}`);
            // TODO If payment is canceled or fails redirect to this page again with an error message
          },
        }
      );
    }
  };

  const totalPrice = startedOrder.reduce(
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

      <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
        <h3 className="text-ellipsis text-lg font-semibold tracking-wide">Tu pedido</h3>

        {startedOrder.length <= 0 && (
          <>
            <p className="tracking-wide">¡Esto está un poco vacío!</p>

            <div className="flex w-full items-center justify-center">
              <Link href={Route.HOME} className="w-fit">
                <Button label="Volver a la carta" />
              </Link>
            </div>
          </>
        )}

        {startedOrder
          .sort((a, b) => b.id - a.id)
          .map((chosenProduct) => (
            <OrderedProduct
              key={chosenProduct.id}
              chosenProduct={chosenProduct}
              addProduct={addProduct}
              removeProduct={removeProduct}
              showPrice
              showProductName
              showOnlyRemove
            />
          ))}

        {startedOrder.length > 0 && totalPrice && (
          <div className="flex items-center justify-end">
            <h3 className="text-ellipsis text-lg font-semibold tracking-wide text-lgp-orange-dark">{`Total ${totalPrice} €`}</h3>
          </div>
        )}

        {isErrorRegisterOrder && <ErrorMessage message="Hubo un error al registrar el pedido." />}
      </div>

      {startedOrder.length > 0 && (
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
              <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{`¡Bienvenido de nuevo ${user.name}!`}</h3>

              <p className="text-sm font-medium tracking-wide">{user.email}</p>

              <small className="text-slate-400">
                Te avisaremos por email cuando tu pedido esté listo y te llamaremos por tu nombre.
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
      )}

      <Button
        isDisabled={
          !watchEmail || watchEmail.length <= 0 || !watchName || watchName.length <= 0 || startedOrder.length <= 0
        }
        isLoading={isLoadingUpdateCustomerInfo || isLoadingRegisterOrder}
        label="Pagar"
        className="fixed left-5 right-5 bottom-5 m-auto w-[unset] lg:max-w-md"
      />
    </form>
  );
};

export default YourOrder;

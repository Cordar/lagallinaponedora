import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
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
import { createContextInner } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { EMAIL_REGEX, ONE_HOUR_MS, Route, StorageKey } from "~/utils/constant";
import { getPaymentPostBody } from "~/utils/encrypt";
import getLayout from "~/utils/getLayout";
import { type NextPageWithLayout } from "./_app";
import getLocale from "~/utils/locale/getLocale";
import getLocaleObject from "~/utils/locale/getLocaleObject";
import { deleteCookie, getCookie } from "cookies-next";
import useOptions from "~/hooks/api/query/useSubproducts";

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  await ssg.public.getProductCategories.prefetch();
  await ssg.public.getOptions.prefetch();
  return {
    props: { trpcState: ssg.dehydrate(), locale: getLocale(context.locale) },
    revalidate: ONE_HOUR_MS / 1000,
  };
};

interface Inputs {
  email: string;
  name: string;
  phone?: string;
  preferred_time?: Date;
}

const YourOrder: NextPageWithLayout = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const locales = getLocaleObject(props.locale);

  const Layout = getLayout(locales.tuPedido.title, locales.tuPedido.description);

  const router = useRouter();
  const queryParams = router.query;
  const isErrorPayment = queryParams.Ds_MerchantParameters != undefined;

  const password = getCookie(StorageKey.ORDER_PASSWORD);
  const isAdmin = password == "admin_lgp_bioc2023";
  const isStaff = password == "bioc2023lgp";

  function generateRandomEmail() {
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    let string = "";
    for (var ii = 0; ii < 15; ii++) {
      string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string + "@lagallinaponedora.com";
  }
  useEffect(() => {
    if (isAdmin) {
      setValue("email", generateRandomEmail());
      deleteCookie(StorageKey.SESSION);
    }
  }, [isAdmin]);

  const { products, isLoadingProducts, isErrorProducts } = useProducts();
  const { options } = useOptions();
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
        <ErrorMessage message={locales.pageLoadError} />
      </div>
    );

  const onFormSubmit: SubmitHandler<Inputs> = ({ email, name, phone, preferred_time }) => {
    phone = phone != null ? phone : "";
    if (user?.sessionId && email && name && startedOrder) {
      mutateUpdateCustomerInfo(
        { sessionId: user.sessionId, email, name, phone },
        {
          onSuccess: () => {
            mutateRegisterOrder(
              {
                sessionId: user.sessionId,
                preferred_time: (preferred_time != null ? preferred_time : "Now").toString(),
                orderProducts: startedOrder.map(({ amount, productId, options: options }) => ({
                  amount,
                  productId,
                  options,
                })),
              },
              {
                onSuccess: async (order) => {
                  if (isAdmin || isStaff) {
                    void router.push(`${Route.ORDER_STATUS}${order.id}`);
                    return;
                  }
                  const paymentBody = getPaymentPostBody(totalPrice, order.id.toString());
                  document.getElementById("hidden_params").value = paymentBody.Ds_MerchantParameters;
                  document.getElementById("hidden_signature").value = paymentBody.Ds_Signature;
                  document.getElementById("hidden_signature_version").value = paymentBody.Ds_SignatureVersion;
                  document.getElementById("pago").submit();
                },
              }
            );
          },
        }
      );
    }
  };

  const totalPrice = startedOrder.reduce(
    (prev, { amount, productId, options: startedOrderOptions }) =>
      prev +
      amount *
        (products != null && options != null
          ? products?.find(({ id }) => id === productId)?.price +
            startedOrderOptions.reduce(
              (accumulator, option) => accumulator + options.find(({ id }) => id == option.optionId)?.price ?? 0,
              0
            )
          : 0),
    0
  );

  const watchEmail = watch("email");
  const watchName = watch("name");

  return Layout(
    <div>
      <form id="pago" action="https://sis.redsys.es/sis/realizarPago" method="POST">
        <input type="hidden" name="Ds_MerchantParameters" id="hidden_params"></input>
        <input type="hidden" name="Ds_Signature" id="hidden_signature"></input>
        <input type="hidden" name="Ds_SignatureVersion" id="hidden_signature_version"></input>
      </form>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex grow flex-col gap-5 bg-lgp-background p-5">
        <div className="flex w-full items-center gap-3">
          <Link href={Route.HOME} className="w-fit">
            <RiArrowLeftLine className="h-8 w-8" />
          </Link>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
          <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{locales.tuPedido.tuPedido}</h3>

          {startedOrder.length <= 0 && (
            <>
              <p className="tracking-wide">{locales.tuPedido.empty}</p>

              <div className="flex w-full items-center justify-center">
                <Link href={Route.HOME} className="w-fit">
                  <Button label="Volver a la carta" />
                </Link>
              </div>
            </>
          )}

          {startedOrder
            .sort((a, b) => b.productId - a.productId)
            .map((chosenProduct) => (
              <OrderedProduct
                key={chosenProduct.id}
                orderProduct={chosenProduct}
                addProduct={addProduct}
                removeProduct={removeProduct}
                showPrice
                showProductName
                locales={locales}
              />
            ))}

          {startedOrder.length > 0 && totalPrice && (
            <div className="flex items-center justify-end">
              <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{`Total ${totalPrice} €`}</h3>
            </div>
          )}

          {isErrorRegisterOrder && <ErrorMessage message={locales.forms.error} />}
          {isErrorPayment && <ErrorMessage message={locales.forms.error} />}
        </div>

        {startedOrder.length > 0 && (
          <div className="mb-3 flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
            {isStaff && (
              <Input
                id={"preferred_time"}
                label={locales.horaDeRecogida}
                type="time"
                min="11:00"
                max="19:30"
                register={register("preferred_time", {
                  required: { value: true, message: `${locales.forms.required}` },
                })}
                errorMessage={getFormError("preferred_time")}
              />
            )}
            {updateData || !user?.email || !user?.name || (isStaff && !user?.phone) ? (
              <>
                <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{locales.tuPedido.quienEres}</h3>
                <small className="text-slate-400">{locales.tuPedido.importantRemember}</small>

                <div className="relative flex w-full grow flex-col gap-5">
                  <Input
                    id={"email"}
                    label={"Email"}
                    register={register("email", {
                      required: { value: true, message: `${locales.forms.required}` },
                      pattern: { value: EMAIL_REGEX, message: `${locales.forms.notValidEmail}` },
                    })}
                    errorMessage={getFormError("email")}
                  />
                  {isStaff && (
                    <>
                      <Input
                        id={"phone"}
                        label={"Teléfono"}
                        register={register("phone", {
                          required: { value: true, message: `${locales.forms.required}` },
                          maxLength: { value: 9, message: `${locales.forms.tooLong}` },
                          minLength: { value: 9, message: `${locales.forms.tooShort}` },
                        })}
                        errorMessage={getFormError("phone")}
                      />
                    </>
                  )}
                  <Input
                    id={"name"}
                    label={locales.name}
                    register={register("name", {
                      required: { value: true, message: `${locales.forms.required}` },
                      maxLength: { value: 16, message: `${locales.forms.tooLong}` },
                      minLength: { value: 2, message: `${locales.forms.tooShort}` },
                    })}
                    errorMessage={getFormError("name")}
                  />

                  <small className="text-slate-400">{locales.tuPedido.useData}</small>

                  {isErrorUpdateCustomerInfo && <ErrorMessage message={locales.forms.error} />}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-ellipsis text-lg font-semibold tracking-wide">{`¡${locales.tuPedido.welcomeAgain} ${user.name}!`}</h3>

                <p className="text-sm font-medium tracking-wide">{user.email}</p>

                <small className="text-slate-400">{locales.tuPedido.remember}</small>

                <button
                  onClick={() => setUpdateData(true)}
                  type="button"
                  className="tracking-wid p-2 font-medium text-slate-500"
                >
                  {locales.tuPedido.changeYourData}
                </button>
              </>
            )}
          </div>
        )}

        <div className="mb-20 flex flex-col justify-center rounded-lg">
          <Link href={Route.LEGAL_ADVISE} className="w-full p-4">
            <p className="text-center font-semibold tracking-wide opacity-60">Aviso Legal</p>
          </Link>

          <Link href={Route.PRIVACY_POLICY} className="w-full p-4">
            <p className="text-center font-semibold tracking-wide opacity-60">Política de Privacidad</p>
          </Link>

          <Link href={Route.TERMS_AND_CONDITIONS} className="w-full p-4">
            <p className="text-center font-semibold tracking-wide opacity-60">Términos y condiciones</p>
          </Link>
        </div>

        <Button
          isDisabled={
            !watchEmail || watchEmail.length <= 0 || !watchName || watchName.length <= 0 || startedOrder.length <= 0
          }
          isLoading={isLoadingUpdateCustomerInfo || isLoadingRegisterOrder}
          label={locales.forms.pay}
          className="fixed bottom-5 left-5 right-5 m-auto w-[unset] lg:max-w-md"
        />
      </form>
    </div>
  );
};

export default YourOrder;

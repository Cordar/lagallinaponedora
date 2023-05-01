import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RiArrowLeftLine } from "react-icons/ri";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Input from "~/components/Input";
import useUserLogin from "~/hooks/api/mutation/useUserLogin";
import useUser from "~/hooks/api/query/useUser";
import { EMAIL_REGEX, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { type NextPageWithLayout } from "./_app";

interface Inputs {
  email: string;
  name: string;
}

const Login: NextPageWithLayout = (props) => {
  const { push } = useRouter();
  const Layout = getLayout("La Gallina Ponedora | Consultar pedidos", "Entra tus datos para ver tus pedidos.");

  const { user, isErrorUser } = useUser();
  const { mutateLoginCustomer, isErrorLoginCustomer, isLoadingLoginCustomer } = useUserLogin();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (user && user.email && user.name) {
      void push(`${Route.HOME}`);
    }
  }, [user]);

  const getFormError = (name: keyof Inputs) => errors[name] && errors[name]?.message;

  if (isErrorUser)
    return Layout(
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message={locales.pageLoadError} />
      </div>
    );

  const onFormSubmit: SubmitHandler<Inputs> = async ({ email, name }) => {
    mutateLoginCustomer(
      { email, name },
      {
        onSuccess: () => {
          void push(`${Route.HOME}`);
        },
      }
    );
  };

  const watchEmail = watch("email");
  const watchName = watch("name");

  return Layout(
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex grow flex-col gap-5 bg-lgp-background p-5">
        <div className="flex w-full items-center gap-3">
          <Link href={Route.HOME} className="w-fit">
            <RiArrowLeftLine className="h-8 w-8" />
          </Link>
        </div>
        <div className="mb-3 flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
          <>
            <h3 className="text-ellipsis text-lg font-semibold tracking-wide">Accede a tus pedidos:</h3>

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
                Recuerda poner el correo y el nombre que pusiste a la hora de pagar.
              </small>

              {isErrorLoginCustomer && <ErrorMessage message="No se ha encontrado un usuario con estos datos" />}
            </div>
          </>
        </div>

        <Button
          isDisabled={!watchEmail || watchEmail.length <= 0 || !watchName || watchName.length <= 0}
          isLoading={isLoadingLoginCustomer}
          label="Acceder"
          className="fixed bottom-5 left-5 right-5 m-auto w-[unset] lg:max-w-md"
        />
      </form>
    </div>
  );
};

export default Login;

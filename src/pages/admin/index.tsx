import { type GetServerSideProps, type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import SVG from "react-inlinesvg";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Input from "~/components/Input";
import useIsPasswordValid from "~/hooks/api/query/useIsPasswordValid";
import useStorage from "~/hooks/useStorage";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "../_app";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = getTrpcSSGHelpers();

  const password = context.req.cookies[StorageKey.PASSWORD];
  const isAuthenticated = password ? await ssg.public.checkPassword.fetch({ password }) : false;

  const props = { trpcState: ssg.dehydrate() };

  if (isAuthenticated) return { redirect: { destination: Route.ADMIN_PANEL, permanent: false }, props };
  return { props };
};

interface Inputs {
  password: string;
}

const AdminPassword: NextPage<PageProps> = () => {
  const { push } = useRouter();
  const { setCookie } = useStorage();

  const Layout = getLayout(
    "La Gallina Ponedora | Password",
    "Introduce la contraseña pera entrar al panel de administración."
  );

  const [passwordToCheck, setPasswordToCheck] = useState<string>();
  const { isPasswordValid, isLoadingIsPasswordValid, isErrorIsPasswordValid, errorIsPasswordValid } =
    useIsPasswordValid(passwordToCheck);

  useEffect(() => {
    if (isPasswordValid && passwordToCheck) {
      setCookie(StorageKey.PASSWORD, passwordToCheck);
      void push(Route.ADMIN_PANEL);
    }
  }, [isPasswordValid, passwordToCheck, push, setCookie]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onFormSubmit: SubmitHandler<Inputs> = ({ password }) => {
    setPasswordToCheck(password);
  };

  const getFormError = (name: keyof Inputs) => errors[name] && errors[name]?.message;

  return Layout(
    <div className="relative flex grow flex-col items-center gap-5 p-5">
      <SVG src="/gallina.svg" className="w-3/4" />

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="mb-3 flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4"
      >
        <h3 className="text-lg font-semibold tracking-wide">Panel de administración</h3>

        <Input
          label="Contraseña"
          type="password"
          id={"password"}
          register={register("password", {
            required: { value: true, message: "Este campo es obligatorio" },
          })}
          errorMessage={getFormError("password")}
        />

        <Button label="Entrar" isLoading={isLoadingIsPasswordValid} />

        {isErrorIsPasswordValid && errorIsPasswordValid && <ErrorMessage message={errorIsPasswordValid.message} />}
      </form>
    </div>
  );
};

export default AdminPassword;

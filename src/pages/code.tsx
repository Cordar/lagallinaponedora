import { type GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import SVG from "react-inlinesvg";
import Button from "~/components/Button";
import ErrorMessage from "~/components/ErrorMessage";
import Input from "~/components/Input";
import { Route, StorageKey } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { setCookie } from "cookies-next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/routers/_app";
import { createContextInner } from "~/server/context";
import { NextPageWithLayout } from "./_app";
import useIsCodeValid from "~/hooks/api/query/useIsCodeValid";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  const props = { trpcState: ssg.dehydrate() };
  return { props };
};

interface Inputs {
  code: string;
}

const Code: NextPageWithLayout = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { push } = useRouter();

  const Layout = getLayout("La Gallina Ponedora | Password", "Introduce el código .");

  const [codeToCheck, setCodeToCheck] = useState<string>();
  const { isCodeValid, isLoadingIsCodeValid, isErrorIsCodeValid, errorIsCodeValid } = useIsCodeValid(codeToCheck);

  useEffect(() => {
    if (isCodeValid && codeToCheck) {
      setCookie(StorageKey.ORDER_PASSWORD, codeToCheck, { maxAge: 60 * 60 * 24 });
      void push(Route.HOME);
    }
  }, [isCodeValid, codeToCheck, push, setCookie]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onFormSubmit: SubmitHandler<Inputs> = ({ code }) => {
    setCodeToCheck(code);
  };

  const getFormError = (name: keyof Inputs) => errors[name] && errors[name]?.message;

  return Layout(
    <div className="relative flex grow flex-col items-center gap-5 p-5">
      <SVG src="/gallina.svg" className="w-3/4" />

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="mb-3 flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4"
      >
        <h3 className="text-lg font-semibold tracking-wide">Introduce tu código</h3>

        <Input
          label="Code"
          type="text"
          id={"code"}
          register={register("code", {
            required: { value: true, message: "Este campo es obligatorio" },
          })}
          errorMessage={getFormError("code")}
        />

        <Button label="Validate" isLoading={isLoadingIsCodeValid} />

        {isErrorIsCodeValid && errorIsCodeValid && <ErrorMessage message={errorIsCodeValid.message} />}
      </form>
    </div>
  );
};

export default Code;

import { type GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/routers/_app";
import { createContextInner } from "~/server/context";
import { NextPageWithLayout } from "./_app";

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  return { props: { trpcState: ssg.dehydrate() }, revalidate: ONE_HOUR_MS / 1000 };
};

const TermsAndConditions: NextPageWithLayout = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const Layout = getLayout("La Gallina Ponedora | Términos y condiciones", "Términos y condiciones");

  return Layout(
    <div className="relative flex w-full grow flex-col gap-5 bg-lgp-background">
      <div className="fixed left-0 right-0 top-0 z-10 bg-lgp-background">
        <div className="m-auto flex w-full items-center bg-lgp-background lg:max-w-xl">
          <Link href={Route.CHECKOUT} className="p-4">
            <RiArrowLeftLine className="h-8 w-8" />
          </Link>
        </div>
      </div>

      <div className="relative mt-16 flex flex-col gap-5 p-5">
        <h1 className="text-lg font-bold">Términos y condiciones</h1>
        <h2 className="text-lg font-semibold">Ámbito de aplicación</h2>
        <p>
          Estos términos y condiciones (los “Términos y Condiciones”) aplicarán al usuario (el “Usuario”) de las páginas
          web que conforman la totalidad del dominio mundimoto.com (la “Web”) al utilizar la Web o al contratar los
          servicios y/o productos que se ofrecen en la misma. Con el uso de la Web, el Usuario declara ser mayor de 18 y
          presta su consentimiento a los mismos y acepta estar vinculado por estos Términos y Condiciones, la Política
          de Privacidad y la Política de Cookies, tal y como puedan ser actualizados en cada momento. Por favor lea
          estos Términos y Condiciones antes de usar la Web.
        </p>
        <h2 className="text-lg font-semibold">Entrega de los productos</h2>
        <p>
          En relación con la entrega de los productos, La Gallina Ponedora pone a disposición una foodtruck en el sitio
          indicado en los carteles que hacen referencia a la web o en la parte de pedidos dónde el usuario podrá recoger
          su pedido una vez esté preparado.
        </p>
        <h2 className="text-lg font-semibold">Cancelación de pedidos</h2>
        <p>Una vez el producto se haya pagado ya no se podrá cancelar.</p>
        <h2 className="text-lg font-semibold">Devolución y reembolso</h2>
        <p>Una vez el producto se haya entregado ya no se podrá devolver ni reembolsar de ninguna manera.</p>
        <h2 className="text-lg font-semibold">Cambios a los Términos y Condiciones</h2>
        <p>
          La Compañía se reserva el derecho a modificar, revisar o actualizar estos Términos y Condiciones en cualquier
          momento y sin previa comunicación al Usuario. Todos los cambios serán efectivos inmediatamente tras su
          publicación en la Web. El Usuario acepta y entiende que es su responsabilidad la revisión de los Términos y
          Condiciones.
        </p>
        <h2 className="text-lg font-semibold">Miscelánea</h2>
        <p>
          Si alguna de las disposiciones de estos Términos y Condiciones es o resulta inválida, la validez de las
          disposiciones restantes no se verá afectada. La disposición inválida será reemplazada por otra válida con
          iguales o equivalentes términos comerciales.
        </p>
        <h2 className="text-lg font-semibold">Legislación aplicable y jurisdicción</h2>
        <p>
          Los presentes Términos y Condiciones se rige exclusivamente por la legislación española (con exclusión expresa
          de la Convención de las Naciones Unidas sobre la Compraventa) y cualquier disputa entre el Usuario y la
          Compañía estará sujeta a los Juzgados y Tribunales del domicilio del Usuario.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;

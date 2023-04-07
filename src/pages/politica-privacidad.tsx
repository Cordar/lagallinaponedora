import { type GetStaticProps, type NextPage } from "next";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "./_app";

export const getStaticProps: GetStaticProps = () => {
  const ssg = getTrpcSSGHelpers();
  return { props: { trpcState: ssg.dehydrate() }, revalidate: ONE_HOUR_MS / 1000 };
};

const PrivacyPolicy: NextPage<PageProps> = () => {
  const Layout = getLayout("La Gallina Ponedora | Política de Privacidad", "Política de Privacidad");

  return Layout(
    <div className="relative flex w-full grow flex-col gap-5 bg-lgp-background">
      <div className="fixed left-0 top-0 right-0 z-10 bg-lgp-background">
        <div className="m-auto flex w-full items-center bg-lgp-background lg:max-w-xl">
          <Link href={Route.CHECKOUT} className="p-4">
            <RiArrowLeftLine className="h-8 w-8" />
          </Link>
        </div>
      </div>

      <div className="relative mt-16 flex flex-col gap-5 p-5">
        <h1 className="text-lg font-bold">POLÍTICA DE PRIVACIDAD</h1>
        <h2 className="text-lg font-semibold">1. INFORMACIÓN AL USUARIO</h2>
        <h3 className="text-lg font-medium">¿Quién es el responsable del tratamiento de tus datos personales?</h3>
        <p className="text-justify">
          Daboli Assesorament S.L. es el RESPONSABLE del tratamiento de los datos personales del USUARIO y le informa de
          que estos datos serán tratados de conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril
          (GDPR), y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD).
        </p>
        <h3 className="text-lg font-medium">¿Para qué tratamos tus datos personales y por qué lo hacemos?</h3>
        <p className="text-justify">
          Gestionar su compra o pedido online, procesar el pago y enviar un correo electrónico para novedades de su
          pedido, en base a las condiciones generales de contratación. Enviar comunicaciones comerciales publicitarias
          por e-mail, fax, SMS, MMS, redes sociales o cualquier otro medio electrónico o físico, presente o futuro, que
          posibilite realizar comunicaciones comerciales. Estas comunicaciones serán realizadas por el responsable y
          estarán relacionadas con sus productos y servicios, o de sus colaboradores o proveedores, con los que este
          haya alcanzado algún acuerdo de promoción. En este caso, los terceros nunca tendrán acceso a los datos
          personales. (por el consentimiento del interesado, 6.1.a GDPR)
        </p>
        <h3 className="text-lg font-medium">¿Durante cuánto tiempo guardaremos tus datos personales?</h3>
        <p className="text-justify">
          Se conservarán durante no más tiempo del necesario para mantener el fin del tratamiento o existan
          prescripciones legales que dictaminen su custodia y cuando ya no sea necesario para ello, se suprimirán con
          medidas de seguridad adecuadas para garantizar la anonimización de los datos o la destrucción total de los
          mismos.
        </p>
        <h3 className="text-lg font-medium">¿A quién facilitamos sus datos personales?</h3>
        <p className="text-justify">
          No está prevista ninguna comunicación de datos personales a terceros salvo, si fuese necesario para el
          desarrollo y ejecución de las finalidades del tratamiento, a nuestros proveedores de servicios relacionados
          con comunicaciones, con los cuales el RESPONSABLE tiene suscritos los contratos de confidencialidad y de
          encargado de tratamiento exigidos por la normativa vigente de privacidad.
        </p>
        <h3 className="text-lg font-medium">¿Cuáles son tus derechos?</h3>
        <p className="text-justify">Los derechos que asisten al USUARIO son:</p>
        <ul>
          <li>Derecho a retirar el consentimiento en cualquier momento.</li>
          <li>
            Derecho de acceso, rectificación, portabilidad y supresión de sus datos, y de limitación u oposición a su
            tratamiento.
          </li>
          <li>
            Derecho a presentar una reclamación ante la autoridad de control (www.aepd.es) si considera que el
            tratamiento no se ajusta a la normativa vigente.
          </li>
        </ul>
        <p className="text-justify">Datos de contacto para ejercer sus derechos:</p>
        <p>
          Daboli Assesorament S.L. C/ Balears, 1, planta baja - 08339 Vilassar de Dalt (Barcelona). E-mail:
          huevos@lagallinaponedora.com
        </p>
        <h2 className="text-lg font-semibold">
          2. CARÁCTER OBLIGATORIO O FACULTATIVO DE LA INFORMACIÓN FACILITADA POR EL USUARIO
        </h2>
        <p className="text-justify">
          Los USUARIOS, mediante la entrada de datos en los campos en el formulario de datos personales, aceptan
          expresamente y de forma libre e inequívoca, que sus datos son necesarios para atender su petición, por parte
          del prestador. El USUARIO garantiza que los datos personales facilitados al RESPONSABLE son veraces y se hace
          responsable de comunicar cualquier modificación de los mismos.
        </p>
        <p className="text-justify">
          El RESPONSABLE informa de que todos los datos solicitados a través del sitio web son obligatorios, ya que son
          necesarios para la prestación de un servicio óptimo al USUARIO. En caso de que no se faciliten todos los
          datos, no se garantiza que la información y servicios facilitados sean completamente ajustados a sus
          necesidades
        </p>
        <h2 className="text-lg font-semibold">3. MEDIDAS DE SEGURIDAD</h2>
        <p className="text-justify">
          Que de conformidad con lo dispuesto en las normativas vigentes en protección de datos personales, el
          RESPONSABLE está cumpliendo con todas las disposiciones de las normativas GDPR y LOPDGDD para el tratamiento
          de los datos personales de su responsabilidad, y manifiestamente con los principios descritos en el artículo 5
          del GDPR, por los cuales son tratados de manera lícita, leal y transparente en relación con el interesado y
          adecuados, pertinentes y limitados a lo necesario en relación con los fines para los que son tratados.
        </p>
        <p className="text-justify">
          El RESPONSABLE garantiza que ha implementado políticas técnicas y organizativas apropiadas para aplicar las
          medidas de seguridad que establecen el GDPR y la LOPDGDD con el fin de proteger los derechos y libertades de
          los USUARIOS y les ha comunicado la información adecuada para que puedan ejercerlos.
        </p>
        <p className="text-justify">
          Para más información sobre las garantías de privacidad, puedes dirigirte al RESPONSABLE a través de Daboli
          Assesorament S.L. C/ Balears, 1, planta baja - 08339 Vilassar de Dalt (Barcelona). E-mail:
          huevos@lagallinaponedora.com
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

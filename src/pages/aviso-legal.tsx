import { type GetStaticProps, type NextPage, InferGetStaticPropsType } from "next";
import { ONE_HOUR_MS, Route } from "~/utils/constant";
import getLayout from "~/utils/getLayout";
import { getTrpcSSGHelpers } from "~/utils/getTrpcSSGHelpers";
import { type PageProps } from "./_app";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

export const getStaticProps: GetStaticProps = async () => {
  const ssg = getTrpcSSGHelpers();
  return { props: { trpcState: ssg.dehydrate() }, revalidate: ONE_HOUR_MS / 1000 };
};

const LegalAdvice: NextPage<PageProps> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const Layout = getLayout("La Gallina Ponedora | Aviso Legal", "");

  return Layout(
    <div className="m-auto p-3">
      <div className="flex w-full items-center gap-3">
        <Link href={Route.CHECKOUT} className="w-fit">
          <RiArrowLeftLine className="h-8 w-8" />
        </Link>
      </div>
      <h1 className="text-lg font-bold">LEY DE LOS SERVICIOS DE LA SOCIEDAD DE LA INFORMACIÓN (LSSI)</h1>
      <p>
        Daboli Assesorament S.L., responsable del sitio web, en adelante RESPONSABLE, pone a disposición de los usuarios
        el presente documento, con el que pretende dar cumplimiento a las obligaciones dispuestas en la Ley 34/2002, de
        11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), BOE N.º 166, así
        como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso. Toda persona que
        acceda a este sitio web asume el papel de usuario, comprometiéndose a la observancia y cumplimiento riguroso de
        las disposiciones aquí dispuestas, así como a cualquier otra disposición legal que fuera de aplicación. Daboli
        Assesorament S.L. se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el
        sitio web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones,
        entendiéndose como suficiente la publicación en el sitio web de Daboli Assesorament S.L.
      </p>
      <h2 className="text-lg font-semibold">1. DATOS IDENTIFICATIVOS</h2>
      <p>Nombre de dominio: lagallinaponedora.com</p>
      <p>Nombre comercial: La Gallina Ponedora</p>
      <p>Denominación social: Daboli Assesorament S.L.</p>
      <p>NIF: B60041522</p>
      <p>Domicilio fiscal: C/ Balears 1, planta baja, 08339 Vilassar de Dalt (BARCELONA)</p>
      <p>Teléfono: 613890195</p>
      <p>
        constituïda por tiempo indefinido ante el Notario de Barcelona Don Javier Garcia Ruiz en fecha 19 de marzo de
        1992 bajo el protocolo número 784, debidamente inscrita en el Registro Mecantil de Barcelona en el folio 193,
        tomo 22166, hoja número B-32377
      </p>
      <h2 className="text-lg font-semibold">2. DERECHOS DE PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
      <p className="text-justify">
        El sitio web, incluyendo a título enunciativo pero no limitativo su programación, edición, compilación y demás
        elementos necesarios para su funcionamiento, los diseños, logotipos, texto y/o gráficos, son propiedad del
        RESPONSABLE o, si es el caso, dispone de licencia o autorización expresa por parte de los autores. Todos los
        contenidos del sitio web se encuentran debidamente protegidos por la normativa de propiedad intelectual e
        industrial, así como inscritos en los registros públicos correspondientes. Independientemente de la finalidad
        para la que fueran destinados, la reproducción total o parcial, uso, explotación, distribución y
        comercialización, requiere en todo caso la autorización escrita previa por parte del RESPONSABLE. Cualquier uso
        no autorizado previamente se considera un incumplimiento grave de los derechos de propiedad intelectual o
        industrial del autor. Los diseños, logotipos, texto y/o gráficos ajenos al RESPONSABLE y que pudieran aparecer
        en el sitio web, pertenecen a sus respectivos propietarios, siendo ellos mismos responsables de cualquier
        posible controversia que pudiera suscitarse respecto a los mismos. El RESPONSABLE autoriza expresamente a que
        terceros puedan redirigir directamente a los contenidos concretos del sitio web, y en todo caso redirigir al
        sitio web principal de lagallinaponedora.com. El RESPONSABLE reconoce a favor de sus titulares los
        correspondientes derechos de propiedad intelectual e industrial, no implicando su sola mención o aparición en el
        sitio web la existencia de derechos o responsabilidad alguna sobre los mismos, como tampoco respaldo, patrocinio
        o recomendación por parte del mismo. Para realizar cualquier tipo de observación respecto a posibles
        incumplimientos de los derechos de propiedad intelectual o industrial, así como sobre cualquiera de los
        contenidos del sitio web, puede hacerlo a través del correo electrónico huevos@lagallinaponedora.com
      </p>
      <h2 className="text-lg font-semibold">3. EXENCIÓN DE RESPONSABILIDADES</h2>
      <p>
        El RESPONSABLE se exime de cualquier tipo de responsabilidad derivada de la información publicada en su sitio
        web siempre que no tenga conocimiento efectivo de que esta información haya sido manipulada o introducida por un
        tercero ajeno al mismo o, si lo tiene, haya actuado con diligencia para retirar los datos o hacer imposible el
        acceso a ellos.
      </p>
      <h3>Uso de Cookies</h3>
      <p>
        Este sitio web puede utilizar cookies técnicas (pequeños archivos de información que el servidor envía al
        ordenador de quien accede a la página) para llevar a cabo determinadas funciones que son consideradas
        imprescindibles para el correcto funcionamiento y visualización del sitio. Las cookies utilizadas tienen, en
        todo caso, carácter temporal, con la única finalidad de hacer más eficaz la navegación, y desaparecen al
        terminar la sesión del usuario. En ningún caso, estas cookies proporcionan por sí mismas datos de carácter
        personal y no se utilizarán para la recogida de los mismos. Mediante el uso de cookies también es posible que el
        servidor donde se encuentra la web reconozca el navegador utilizado por el usuario con la finalidad de que la
        navegación sea más sencilla, permitiendo, por ejemplo, el acceso de los usuarios que se hayan registrado
        previamente a las áreas, servicios, promociones o concursos reservados exclusivamente a ellos sin tener que
        registrarse en cada visita. También se pueden utilizar para medir la audiencia, parámetros de tráfico, controlar
        el progreso y número de entradas, etc., siendo en estos casos cookies prescindibles técnicamente, pero
        beneficiosas para el usuario. Este sitio web no instalará cookies prescindibles sin el consentimiento previo del
        usuario. El usuario tiene la posibilidad de configurar su navegador para ser alertado de la recepción de cookies
        y para impedir su instalación en su equipo. Por favor, consulte las instrucciones de su navegador para ampliar
        esta información.
      </p>
      <h3>Política de enlaces</h3>
      <p>
        Desde el sitio web, es posible que se redirija a contenidos de terceros sitios web. Dado que el RESPONSABLE no
        puede controlar siempre los contenidos introducidos por terceros en sus respectivos sitios web, no asume ningún
        tipo de responsabilidad respecto a dichos contenidos. En todo caso, procederá a la retirada inmediata de
        cualquier contenido que pudiera contravenir la legislación nacional o internacional, la moral o el orden
        público, procediendo a la retirada inmediata de la redirección a dicho sitio web, poniendo en conocimiento de
        las autoridades competentes el contenido en cuestión. El RESPONSABLE no se hace responsable de la información y
        contenidos almacenados, a título enunciativo pero no limitativo, en foros, chats, generadores de blogs,
        comentarios, redes sociales o cualquier otro medio que permita a terceros publicar contenidos de forma
        independiente en la página web del RESPONSABLE. Sin embargo, y en cumplimiento de lo dispuesto en los artículos
        11 y 16 de la LSSICE, se pone a disposición de todos los usuarios, autoridades y fuerzas de seguridad,
        colaborando de forma activa en la retirada o, en su caso, bloqueo de todos aquellos contenidos que puedan
        afectar o contravenir la legislación nacional o internacional, los derechos de terceros o la moral y el orden
        público. En caso de que el usuario considere que existe en el sitio web algún contenido que pudiera ser
        susceptible de esta clasificación, se ruega lo notifique de forma inmediata al administrador del sitio web. Este
        sitio web se ha revisado y probado para que funcione correctamente. En principio, puede garantizarse el correcto
        funcionamiento los 365 días del año, 24 horas al día. Sin embargo, el RESPONSABLE no descarta la posibilidad de
        que existan ciertos errores de programación, o que acontezcan causas de fuerza mayor, catástrofes naturales,
        huelgas o circunstancias semejantes que hagan imposible el acceso a la página web.
      </p>
      <h3>Direcciones IP</h3>
      <p>
        Los servidores del sitio web podrán detectar de manera automática la dirección IP y el nombre de dominio
        utilizados por el usuario. Una dirección IP es un número asignado automáticamente a un ordenador cuando este se
        conecta a Internet. Toda esta información se registra en un fichero de actividad del servidor que permite el
        posterior procesamiento de los datos con el fin de obtener mediciones únicamente estadísticas que permitan
        conocer el número de impresiones de páginas, el número de visitas realizadas a los servidores web, el orden de
        visitas, el punto de acceso, etc.
      </p>
      <h3>Transacciones</h3>
      <p>
        Este comerciante se compromete a no permitir ninguna transacción que sea ilegal, o se considere por las marcas
        de tarjetas de crédito o el banco adquiriente, que pueda o tenga el potencial de dañar la buena voluntad de los
        mismos o influir de manera negativa en ellos. Las siguientes actividades están prohibidas en virtud de los
        programas de las marcas de tarjetas: la venta u oferta de un producto o servicio que no sea de plena conformidad
        con todas las leyes aplicables al Comprador, Banco Emisor, Comerciante, Titular de la tarjeta, o tarjetas.
        Además, las siguientes actividades también están prohibidas explícitamente: "Venta de bebidas alcohólicas a
        menores de 18 años.
      </p>
    </div>
  );
};

export default LegalAdvice;

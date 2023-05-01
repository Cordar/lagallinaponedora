import { Locale } from "./Locale";

const getLocale = (locale?: string) => {
  switch (locale) {
    case "en":
      return Locale.EN;
    case "ca":
      return Locale.CA;
    case "es-ES":
    case "es":
    default:
      return Locale.ES;
  }
};

export default getLocale;

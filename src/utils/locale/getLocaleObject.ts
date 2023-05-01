import { Locale } from "./Locale";
import caLocales from "./ca";
import enLocales from "./en";
import esLocales from "./es";

const getLocaleObject = (locale?: Locale) => {
  switch (locale) {
    case Locale.CA:
      return caLocales;
    case Locale.EN:
      return enLocales;
    case Locale.ES:
    default:
      return esLocales;
  }
};

export default getLocaleObject;

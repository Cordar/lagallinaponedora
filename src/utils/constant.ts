export enum Route {
  HOME = "/",
  CUSTOMIZE_PRODUCT = "/personalizar-producto/",
  CHECKOUT = "/tu-pedido/",
}

export enum Cookie {
  SESSION = "lagallinaponedora_session",
}

export const ONE_DAY = 1000 * 60 * 60 * 24;
export const ONE_YEAR = ONE_DAY * 365;

export const EMAIL_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

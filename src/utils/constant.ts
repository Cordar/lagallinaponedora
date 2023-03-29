export enum Route {
  HOME = "/",
  CUSTOMIZE_PRODUCT = "/personalizar-producto/",
  CHECKOUT = "/tu-pedido/",
  ORDER_STATUS = "/estado-de-tu-pedido/",
  PAY = "/api/checkout_sessions/"
}

export enum StorageKey {
  SESSION = "lagallinaponedora_session",
  STARTED_ORDER = "lagallinaponedora_started_order",
}

export const ONE_MINUTE_MS = 1000 * 60;
export const ONE_HOUR_MS = ONE_MINUTE_MS * 60;
export const ONE_DAY_MS = ONE_HOUR_MS * 24;
export const ONE_YEAR_MS = ONE_DAY_MS * 365;

export const EMAIL_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

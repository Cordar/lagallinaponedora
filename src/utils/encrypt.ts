import { Route } from "./constant";

declare function require(name: string): any;
const CryptoJS = require("crypto-js");

interface MerchantParameters {
  DS_MERCHANT_AMOUNT: string;
  DS_MERCHANT_CURRENCY: string;
  DS_MERCHANT_CVV2: string;
  DS_MERCHANT_EXPIRYDATE: string;
  DS_MERCHANT_MERCHANTCODE: string;
  DS_MERCHANT_ORDER: string;
  DS_MERCHANT_PAN: string;
  DS_MERCHANT_TERMINAL: string;
  DS_MERCHANT_TRANSACTIONTYPE: string;
}

function des_encrypt(message: any, key: any) {
  let ivArray = [0, 0, 0, 0, 0, 0, 0, 0];
  let IV = ivArray.map((item) => String.fromCharCode(item)).join("");

  let encode_str = CryptoJS.TripleDES.encrypt(message, key, {
    iv: CryptoJS.enc.Utf8.parse(IV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encode_str.toString();
}

function stringBase64Encode(input: any) {
  let utf8Input = CryptoJS.enc.Utf8.parse(input);
  return CryptoJS.enc.Base64.stringify(utf8Input);
}

function bytesBase64Encode(input: any) {
  return CryptoJS.enc.Base64.stringify(input);
}

function base64Decode(input: any) {
  //Decodifica el Base64 y devuelve el array de bytes directamente
  return CryptoJS.enc.Base64.parse(input);
}

export function getPaymentPostBody(price: number, orderId: string) {
  const merchantOrder = ("0000" + orderId).slice(-4);
  const merchantParams = {
    DS_MERCHANT_AMOUNT: price * 100,
    DS_MERCHANT_CURRENCY: "978",
    DS_MERCHANT_MERCHANTCODE: "358857522",
    DS_MERCHANT_ORDER: merchantOrder,
    DS_MERCHANT_TERMINAL: "1",
    DS_MERCHANT_TRANSACTIONTYPE: "0",
    DS_MERCHANT_URLOK: process.env.NEXT_PUBLIC_BASE_URL + Route.ORDER_STATUS + orderId,
    DS_MERCHANT_URLKO: process.env.NEXT_PUBLIC_BASE_URL + Route.CHECKOUT,
    DS_MERCHANT_MERCHANTURL: process.env.NEXT_PUBLIC_BASE_URL,
  };

  const encodedParameters = stringBase64Encode(JSON.stringify(merchantParams));

  const key = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";
  const encodedSignatureDES = des_encrypt(merchantOrder, base64Decode(key)); //Se cifra el número de pedido con la clave para obtener la clave de operación

  const encodedDsSignature = CryptoJS.HmacSHA256(encodedParameters, base64Decode(encodedSignatureDES)); //Se calcula el HMAC de los parámetros en Base64 con la clave de operación

  const dsSignature = CryptoJS.enc.Base64.stringify(encodedDsSignature); //Se pasa a Base 64

  const ds_signature_version = "HMAC_SHA256_V1";

  const encodedRequest = {
    Ds_MerchantParameters: encodedParameters,
    Ds_Signature: dsSignature,
    Ds_SignatureVersion: ds_signature_version,
  };

  return encodedRequest;
}

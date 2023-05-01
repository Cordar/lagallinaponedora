export interface LocaleObject {
  appName: string;
  pageLoadError: string;

  home: {
    title: string;
    description: string;
    login: string;
    button1: string;
    button2: string;
    pedidoListo: string;
    pedidoEnProceso: string;
  };

  tuPedido: {
    title: string;
    description: string;
  };

  terminosYCondiciones: {
    title: string;
    description: string;
  };

  politicaPrivacidad: {
    title: string;
    description: string;
  };

  login: {
    title: string;
    description: string;
  };

  avisoLegal: {
    title: string;
    description: string;
  };

  personalizarProducto: {
    title: string;
    description: string;
  };

  estadoDeTuPedido: {
    title: string;
    description: string;
  };
}

export enum Locale {
  ES = "ES",
  CA = "CA",
  EN = "EN",
}

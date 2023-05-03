export interface LocaleObject {
  appName: string;
  pageLoadError: string;
  specialOffers: string;
  toEat: string;
  toDrink: string;
  menuCompleto: string;
  menu: string;
  plato: string;
  picar: string;
  aperitivo: string;
  postre: string;
  bebida: string;
  botella: string;
  cocktail: string;
  escogeProteina: string;
  escogeBase: string;
  escogeSalsa: string;
  escogePicar: string;
  escogeAperitivo: string;
  escogePostre: string;
  escogeBebida: string;
  escogeBotella: string;
  escogeCocktail: string;
  ternera: string;
  pollo: string;
  tofu: string;
  extraVerdura: string;
  pan: string;
  pasta: string;
  arroz: string;
  sinBase: string;
  manzanaJengibre: string;
  curry: string;
  rasElHanout: string;
  sinSalsa: string;
  patatasGrill: string;
  snacksVerdura: string;
  gazpacho: string;
  frutaCortada: string;
  arrozConLeche: string;
  aguaMineral: string;
  limonada: string;
  sanMiguelEco: string;
  vinoBlanco: string;
  vinoTinto: string;
  cava: string;
  mojito: string;
  mojitoCerveza: string;
  pinaColada: string;
  daiquiriDeFresa: string;
  add: string;
  outOfStock: string;

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

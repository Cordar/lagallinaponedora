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
  escogePlato: string;
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
  macarronesBolonyesa: string;
  arrosMuntanya: string;
  paellaVegana: string;
  tacosTernera: string;
  add: string;
  outOfStock: string;
  horaDeRecogida: string;
  orderNumber: string;
  calculando: string;
  name: string;

  home: {
    title: string;
    description: string;
    login: string;
    button1: string;
    button2: string;
    pedidoListo: string;
    pedidoEnProceso: string;
    see: string;
  };

  tuPedido: {
    title: string;
    description: string;
    tuPedido: string;
    quienEres: string;
    importantRemember: string;
    useData: string;
    welcomeAgain: string;
    remember: string;
    changeYourData: string;
    empty: string;
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
    access: string;
    reminder: string;
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
    instructionsPickUp: string;
    prepararPedido: string;
    cookQueue: string;
    orderReady: string;
    orderInfoWhenReady: string;
    orderAlsoWaiting: string;
    comeToTheFoodTruck: string;
  };

  forms: {
    required: string;
    notValidEmail: string;
    tooLong: string;
    tooShort: string;
    error: string;
    access: string;
    pay: string;
  };
}

export enum Locale {
  ES = "ES",
  CA = "CA",
  EN = "EN",
}

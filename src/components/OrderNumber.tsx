import { LocaleObject } from "~/utils/locale/Locale";

export interface OrderNumberProps {
  orderId: number;
  showText?: boolean;
  small?: boolean;
  locales: LocaleObject;
}

const OrderNumber = ({ orderId, showText, small, locales }: OrderNumberProps) => (
  <div>
    <h3 className={`text-ellipsis text-center  font-semibold tracking-wide ${small ? "text-sm" : "text-6xl"}`}>
      {orderId}
    </h3>
    {showText && (
      <p className="text-ellipsis text-center text-xs tracking-wide text-slate-600">{locales?.orderNumber}</p>
    )}
  </div>
);

export default OrderNumber;

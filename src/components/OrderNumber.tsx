export interface OrderNumberProps {
  orderId: number;
}

const OrderNumber = ({ orderId }: OrderNumberProps) => (
  <div>
    <h3 className="text-ellipsis text-center text-6xl font-semibold tracking-wide">{orderId}</h3>
    <p className="text-ellipsis text-center text-xs tracking-wide text-slate-600">Número de tu pedido</p>
  </div>
);

export default OrderNumber;

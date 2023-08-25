import { string, oneOfType, node, element } from 'prop-types';

const OrderNoLabel = ({ dateLabel, orderNo, children }) => (
  <div className="order-no-label">
    <span className="order-no-label__order-no-wrap">
      {dateLabel}
      <span className="order-no-label__no">{orderNo}</span>
    </span>
    {children}
  </div>
);

export default OrderNoLabel;

OrderNoLabel.propTypes = {
  dateLabel: string,
  orderNo: string,
  children: oneOfType([node, element]),
};

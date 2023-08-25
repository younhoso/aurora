import { Link } from 'react-router-dom';

import { string, number } from 'prop-types';

import { convertToKoreanCurrency } from '@shopby/shared';

const OrderSummary = ({ orderYmd, orderTitle, imageUrl, orderNo, totalProductAmt, redirectUrl }) => (
  <Link className="orders__order-summary" to={redirectUrl}>
    <p className="orders__identifier">
      <time dateTime={orderYmd} className="bold">
        {orderYmd?.split('-').join('.')}
      </time>
      <span className="orders__order-no">{orderNo}</span>
    </p>
    <div className="orders__product">
      <img src={imageUrl} alt={`${orderTitle} 상품 이미지`}></img>
      <div className="orders__product-description">
        <h3 className="orders__product-name">{orderTitle}</h3>
        <div className="orders__product-tag">
          <span className="orders__pay-amount-label">
            <span className="orders__pay-amount">{convertToKoreanCurrency(totalProductAmt)}</span>원
          </span>
        </div>
      </div>
    </div>
  </Link>
);

export default OrderSummary;

OrderSummary.propTypes = {
  orderYmd: string.isRequired,
  orderTitle: string.isRequired,
  imageUrl: string.isRequired,
  orderNo: string.isRequired,
  totalProductAmt: number.isRequired,
  statusLabel: string.isRequired,
  redirectUrl: string,
};

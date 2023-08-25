import { object, bool, shape, string, number, oneOf } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

const COUPON_TYPE_LABEL = {
  PRODUCT: '상품',
  CART: '주문',
  CART_DELIVERY: '장바구니 배송비',
};

// 쿠폰 할인 정보
const getDiscountInfo = (coupon) => {
  const limitSalePrice = coupon.minSalePrice;

  if (coupon.discountRate) {
    return {
      amount: coupon.discountRate,
      unit: '%',
      maxAmount: coupon.maxDiscountAmt,
      limitSalePrice,
    };
  }

  return {
    amount: convertToKoreanCurrency(coupon.discountAmt),
    unit: '원',
    maxAmount: 0,
    limitSalePrice,
  };
};

const CouponItem = ({ coupon, unissuable, customElement = <></> }) => {
  const { amount, unit, maxAmount, limitSalePrice } = getDiscountInfo(coupon);
  const couponTypeLabel = COUPON_TYPE_LABEL[coupon.couponType];
  const issueDate = coupon.issueYmdt?.slice(0, 10);
  const expireDate = coupon.expireYmdt?.slice(0, 10);

  return (
    <li className={`my-page-coupon__list-item my-page-coupon__list-item--${unissuable ? 'unissuable' : 'issuable'}`}>
      <div className="my-page-coupon__box">
        <div className="my-page-coupon__box--left">
          <p className="my-page-coupon__discounted-price">
            {convertToKoreanCurrency(amount)}
            <span className="my-page-coupon__unit">{unit}</span>
            <span className="my-page-coupon__discount-label">{couponTypeLabel} 할인</span>
          </p>
          <div className="my-page-coupon__content">
            <p className="my-page-coupon__name">{coupon.couponName}</p>
            <VisibleComponent
              shows={maxAmount > 0}
              TruthyComponent={
                <p className="my-page-coupon__max-amount">최대 {convertToKoreanCurrency(maxAmount)} 원 할인</p>
              }
            />
            <VisibleComponent
              shows={limitSalePrice > 0}
              TruthyComponent={
                <p className="my-page-coupon__limit-sale-price">
                  {convertToKoreanCurrency(limitSalePrice)} 원 이상 구매 시 사용가능
                </p>
              }
            />
          </div>
          <p className="my-page-coupon__date">{issueDate ? `${issueDate} ~ ${expireDate}` : `${expireDate}`}</p>
        </div>
        <div className="my-page-coupon__box--right">
          <p>COUPON</p>
        </div>
        {customElement}
      </div>
    </li>
  );
};

export default CouponItem;

CouponItem.propTypes = {
  coupon: shape({
    couponName: string,
  }),
  unissuable: bool,
  discountRate: number,
  discountAmt: number,
  issueYmdt: string,
  expireYmdt: string,
  maxDiscountAmt: number,
  minSalePrice: number,
  couponType: oneOf(['PRODUCT', 'CART', 'CART_DELIVERY']),
  customElement: object,
};

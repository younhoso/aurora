import { useEffect, useMemo } from 'react';

import { string, shape, number, arrayOf, func } from 'prop-types';

import {
  Button,
  Radio,
  useModalActionContext,
  OrderSheetCouponProvider,
  useOrderSheetCouponStateContext,
  useOrderSheetCouponActionContext,
  useMallStateContext,
} from '@shopby/react-components';
import { ParameterTypeError, convertToKoreanCurrency } from '@shopby/shared';

import FullModal from '../../components/FullModal';
import InfoList from '../../components/InfoList';

const COUPON_TYPES = ['PRODUCT', 'CART'];

const CouponModalContent = ({ orderSheetNo, initialCoupon, onClose, onApplyCouponBtnClick }) => {
  const {
    couponAmount: { cartCouponDiscountAmt, productCouponDiscountAmt },
    couponStatus,
  } = useOrderSheetCouponStateContext();
  const {
    accumulationConfig: { accumulationName },
  } = useMallStateContext();
  const { selectCouponIndividually, isUsingCoupon, fetchCouponStatus, getSelectedCoupon } =
    useOrderSheetCouponActionContext();
  const allCouponAmt = useMemo(() => cartCouponDiscountAmt + productCouponDiscountAmt);
  const { openAlert } = useModalActionContext();

  const couponNotices = useMemo(
    () => [
      '상품 쿠폰과 장바구니 쿠폰은 함께 사용할 수 있습니다. 단, 일부 상품은 중복사용이 제외 됩니다.',
      '쿠폰 사용불가 상품은 쿠폰할인 적용이 불가합니다.',
      `쿠폰할인 시 구매 ${accumulationName} 적립이 불가합니다.`,
      'PAYCO 전용 쿠폰은 PAYCO 결제만 가능합니다.',
    ],
    [accumulationName]
  );

  useEffect(() => {
    if (!orderSheetNo) return;

    fetchCouponStatus(orderSheetNo, initialCoupon);
  }, [orderSheetNo]);

  const handleCouponSelect = async (couponIssueNo, type, productNo) => {
    if (!COUPON_TYPES.includes(type))
      ParameterTypeError.of({ parameterName: 'type', functionName: handleCouponSelect.name });

    try {
      await selectCouponIndividually({
        couponIssueNo,
        type,
        productNo,
      });
    } catch (e) {
      openAlert({
        message: e.message,
      });
    }
  };

  const handleApplyCouponBtnClick = () => {
    onApplyCouponBtnClick?.(getSelectedCoupon());
  };

  return (
    <FullModal title="상품 쿠폰 조회 및 적용" onClose={onClose} className="coupon-modal">
      <div className="coupon-modal__summary">
        <div className="coupon-modal__summary-item">
          <p>상품 쿠폰</p>
          <p>
            <span className="bold">{convertToKoreanCurrency(productCouponDiscountAmt)}</span> 원
          </p>
        </div>
        <span className="coupon-modal__formula-symbol"> + </span>
        <div className="coupon-modal__summary-item">
          <p>장바구니 쿠폰</p>
          <p>
            <span className="bold">{convertToKoreanCurrency(cartCouponDiscountAmt)} </span> 원
          </p>
        </div>
        <span className="coupon-modal__formula-symbol"> = </span>
        <div className="coupon-modal__summary-item">
          <p>할인금액 합계</p>
          <p>
            <em className="bold highlight">{convertToKoreanCurrency(allCouponAmt)} 원</em>
          </p>
        </div>
      </div>
      <div className="coupon-modal__details">
        <div className="coupon-modal__coupon-details">
          <section className="coupon-modal__coupon-section">
            <p className="coupon-modal__coupon-type">상품 쿠폰 (상품쿠폰은 상품당 한 쿠폰만 적용됩니다.)</p>
            {couponStatus?.products.map(({ productName, productNo, productCoupons }) => (
              <div key={productNo}>
                <p>{productName}</p>
                <div className="coupon-modal__controller">
                  <div className="coupon-modal__controller-item">
                    <Radio
                      id={`coupon-controller-${productNo}-0`}
                      name={`coupon-controller-${productNo}`}
                      value="0"
                      onChange={() => handleCouponSelect(null, 'PRODUCT', productNo)}
                      checked={!isUsingCoupon('PRODUCT', productNo)}
                    />
                    <label htmlFor={`coupon-controller-${productNo}-0`}>선택 없음</label>
                  </div>
                  {productCoupons.map(({ couponIssueNo, couponName, useEndYmdt, couponDiscountAmt, selected }) => (
                    <div key={`${productNo}-${couponIssueNo}`} className="coupon-modal__controller-item">
                      <Radio
                        id={`coupon-controller-${productNo}-${couponIssueNo}`}
                        name={`coupon-controller-${productNo}`}
                        value={couponIssueNo}
                        onChange={() => handleCouponSelect(couponIssueNo, 'PRODUCT', productNo)}
                        checked={selected}
                      />
                      <label htmlFor={`coupon-controller-${productNo}-${couponIssueNo}`}>
                        {couponName}
                        <br />
                        <span className="coupon-modal__date">(~{useEndYmdt.slice(0, 10)})</span>
                      </label>
                      <span className="coupon-modal__coupon-amount">
                        {convertToKoreanCurrency(couponDiscountAmt)}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <section className="coupon-modal__coupon-section">
            <p className="coupon-modal__coupon-type">장바구니 쿠폰 (쿠폰불가 상품 구매 시 사용이 불가합니다.)</p>
            <div className="coupon-modal__controller">
              <div className="coupon-modal__controller-item">
                <Radio
                  id={`coupon-controller-cart-0`}
                  name="coupon-controller-cart"
                  value="0"
                  onChange={() => handleCouponSelect(null, 'CART')}
                  checked={!isUsingCoupon('CART')}
                />
                <label htmlFor={`coupon-controller-cart-0`}>선택 없음</label>
              </div>
              {couponStatus?.cartCoupons.map(
                ({ couponIssueNo, couponName, selected, useEndYmdt, couponDiscountAmt }) => (
                  <div key={couponIssueNo} className="coupon-modal__controller-item">
                    <Radio
                      id={`coupon-controller-cart-${couponIssueNo}`}
                      name="coupon-controller-cart"
                      value={couponIssueNo}
                      onChange={() => handleCouponSelect(couponIssueNo, 'CART')}
                      checked={selected}
                    />
                    <label htmlFor={`coupon-controller-cart-${couponIssueNo}`}>
                      {couponName}
                      <br />
                      <span className="coupon-modal__date">(~{useEndYmdt.slice(0, 10)})</span>
                    </label>
                    <span className="coupon-modal__coupon-amount">{convertToKoreanCurrency(couponDiscountAmt)}원</span>
                  </div>
                )
              )}
            </div>
          </section>
          <Button className="coupon-modal__apply-btn" label="쿠폰 적용" onClick={handleApplyCouponBtnClick} />
        </div>

        <InfoList className="coupon-modal__info" title="쿠폰할인 유의사항" infos={couponNotices} />
      </div>
    </FullModal>
  );
};

const CouponModal = ({ orderSheetNo, initialCoupon, onClose, onApplyCouponBtnClick }) => {
  if (!orderSheetNo) return <></>;

  return (
    <OrderSheetCouponProvider>
      <CouponModalContent
        orderSheetNo={orderSheetNo}
        initialCoupon={initialCoupon}
        onClose={onClose}
        onApplyCouponBtnClick={onApplyCouponBtnClick}
      />
    </OrderSheetCouponProvider>
  );
};

export default CouponModal;

CouponModalContent.propTypes = {
  orderSheetNo: string.isRequired,
  initialCoupon: shape({
    productCoupons: arrayOf(
      shape({
        productNo: number.isRequired,
        couponIssueNo: number.isRequired,
      })
    ),
    cartCouponIssueNo: number.isRequired,
    promotionCode: string.isRequired,
    channelType: string,
  }),
  onClose: func,
  onApplyCouponBtnClick: func,
};

CouponModal.propTypes = {
  orderSheetNo: string,
  initialCoupon: shape({
    productCoupons: arrayOf(
      shape({
        productNo: number.isRequired,
        couponIssueNo: number.isRequired,
      })
    ),
    cartCouponIssueNo: number.isRequired,
    promotionCode: string.isRequired,
    channelType: string,
  }),
  onClose: func,
  onApplyCouponBtnClick: func,
};

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  InputWithUnit,
  Button,
  useOrderSheetStateContext,
  useOrderSheetActionContext,
  useAuthActionContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import CouponModal from './CouponModal';

const PromotionController = () => {
  const navigate = useNavigate();
  const {
    orderSheetNo,
    accumulationInputValue,
    paymentInfo: { availableMaxAccumulationAmt, accumulationAmt, cartCouponAmt, productCouponAmt },
    selectedCoupon,
  } = useOrderSheetStateContext();
  const { updateAccumulationInputValue, updateSelectedCoupon } = useOrderSheetActionContext();
  const { isSignedIn: checkIsSignedIn } = useAuthActionContext();
  const isSignedIn = useMemo(() => checkIsSignedIn(), []);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const allCouponAmt = useMemo(() => cartCouponAmt + productCouponAmt, [cartCouponAmt, productCouponAmt]);

  const handleAccumulationInputChange = ({ currentTarget: { value } }) => {
    let valueByNumber = Number(value);

    if (valueByNumber > availableMaxAccumulationAmt) {
      valueByNumber = availableMaxAccumulationAmt;
    }

    updateAccumulationInputValue(valueByNumber);
  };

  const handleUseAllAccumulationBtnClick = () => {
    updateAccumulationInputValue(availableMaxAccumulationAmt);
  };

  const handleOpenCouponModalBtnClick = () => {
    setIsCouponModalOpen(true);
  };

  const handleCouponModalCloseBtnClick = () => {
    setIsCouponModalOpen(false);
  };

  const handleCouponModalApplyCouponBtnClick = (selectedCoupon) => {
    setIsCouponModalOpen(false);
    updateAccumulationInputValue(0);
    updateSelectedCoupon(selectedCoupon);
  };

  const handleSignInBtnClick = () => {
    navigate('/sign-in');
  };

  if (!isSignedIn)
    return (
      <section className="l-panel order-sheet__promotion">
        <p className="order-sheet__promotion-title">
          <span>혜택 적용</span>
        </p>
        <div className="order-sheet__promotion-items order-sheet__promotion-items--guest">
          <div>
            <p>비회원으로 주문하실 경우 할인 쿠폰 사용이 불가능하며,</p>
            <p>
              <em>적립금 적립 및 혜택을 이용하실 수 없습니다.</em>
            </p>
          </div>
          <Button className="order-sheet__sign-in-btn" label="회원 로그인" onClick={handleSignInBtnClick} />
        </div>
      </section>
    );

  return (
    <section className="l-panel order-sheet__promotion">
      <p className="order-sheet__promotion-title">혜택 적용</p>
      <div className="order-sheet__promotion-items">
        <div className="order-sheet__item">
          <span className="order-sheet__item-subject">쿠폰할인</span>
          <p className="order-sheet__promotion-input">
            <InputWithUnit unitLabel="원" value={allCouponAmt} valid="NUMBER" showsComma={true} disabled />
            <Button label="쿠폰 사용" onClick={handleOpenCouponModalBtnClick} />
            {isCouponModalOpen && (
              <CouponModal
                initialCoupon={selectedCoupon}
                orderSheetNo={orderSheetNo}
                onClose={handleCouponModalCloseBtnClick}
                onApplyCouponBtnClick={handleCouponModalApplyCouponBtnClick}
              />
            )}
          </p>
        </div>
        <div className="order-sheet__item">
          <label htmlFor="accumulation-input" className="order-sheet__item-subject">
            적립금
          </label>
          <p className="order-sheet__promotion-input">
            <InputWithUnit
              id="accumulation-input"
              unitLabel="원"
              onChange={handleAccumulationInputChange}
              value={accumulationInputValue}
              valid="NUMBER"
              showsComma={true}
            />
            <Button label="모두 사용" onClick={handleUseAllAccumulationBtnClick} />
          </p>
        </div>
        <div className="order-sheet__accumulation-amt">
          <p>보유 적립금: {convertToKoreanCurrency(accumulationAmt)}원</p>
          <p>사용가능한 적립금: {convertToKoreanCurrency(availableMaxAccumulationAmt)}원</p>
        </div>
      </div>
    </section>
  );
};

export default PromotionController;

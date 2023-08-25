import { useMemo } from 'react';

import { string, number } from 'prop-types';

import { Button, useModalActionContext, useMallStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency, copyToClipboard, PAY_TYPES_THAT_SHOULD_SHOW_BANK_INFO } from '@shopby/shared';

import PriceTag from '../PriceTag';

const OrderDetailPaymentInfo = ({
  payType = 'ACCOUNT',
  payTypeLabel = '무통장입금',
  bankName = '',
  bankAccount = '',
  bankDepositorName = '',
  bankAmt = 0,
  remitterName = '',
  paymentExpirationYmdt = '',
  totalStandardAmt = 0,
  totalDeliveryAmt = 0,
  totalDiscountAmt = 0,
  subPayAmt = 0,
  chargeAmt = 0,
  accumulationAmtWhenBuyConfirm = 0,
}) => {
  const { openAlert } = useModalActionContext();
  const needsToShowBankInfo = useMemo(() => PAY_TYPES_THAT_SHOULD_SHOW_BANK_INFO.includes(payType), [payType]);

  const {
    accumulationConfig: { accumulationName },
  } = useMallStateContext();

  const priceTagDetails = useMemo(
    () => [
      {
        name: '상품금액 합계',
        amountLabel: convertToKoreanCurrency(totalStandardAmt),
      },
      {
        name: '배송비 합계',
        amountLabel: `+ ${convertToKoreanCurrency(totalDeliveryAmt)}`,
      },
      {
        name: '할인금액 합계',
        amountLabel: `- ${convertToKoreanCurrency(totalDiscountAmt)}`,
      },
      {
        name: `${accumulationName} 사용`,
        amountLabel: `- ${convertToKoreanCurrency(subPayAmt)}`,
      },
    ],
    [totalStandardAmt, totalDeliveryAmt, totalDiscountAmt, subPayAmt, accumulationName]
  );

  const handleCopyAccountBtnClick = () => {
    copyToClipboard(bankAccount, () => openAlert({ message: '계좌번호가 복사되었습니다.' }));
  };

  return (
    <section className="l-panel order-detail-info">
      <p className="order-detail-info__item-title">결제정보</p>
      <div className="order-detail-info__pay-method">
        <p>{payTypeLabel}</p>
        {needsToShowBankInfo && (
          <>
            <dl>
              <dt>입금 은행</dt>
              <dd>{bankName}</dd>
              <dt>입금 계좌</dt>
              <dd>{bankAccount}</dd>
              <dt>예금주명</dt>
              <dd>{bankDepositorName}</dd>
              <dt>입금 금액</dt>
              <dd>{convertToKoreanCurrency(bankAmt)}원</dd>
              <dt>입금자명</dt>
              <dd>{remitterName}</dd>
              <dt>입금 기한</dt>
              <dd>{paymentExpirationYmdt} 까지</dd>
            </dl>
            <Button
              className="order-detail-info__copy-btn"
              label={'계좌번호 복사'}
              onClick={handleCopyAccountBtnClick}
            />
          </>
        )}
      </div>
      <PriceTag
        finalAmount={{ amountLabel: convertToKoreanCurrency(chargeAmt) }}
        details={priceTagDetails}
        showsBorder={false}
      >
        <span className="order-detail-info__mileage">
          구매확정 시&nbsp;
          <em>
            {convertToKoreanCurrency(accumulationAmtWhenBuyConfirm)} {accumulationName}
          </em>
          &nbsp;적립
        </span>
      </PriceTag>
    </section>
  );
};

export default OrderDetailPaymentInfo;

OrderDetailPaymentInfo.propTypes = {
  payType: string,
  payTypeLabel: string,
  bankName: string,
  bankAccount: string,
  bankDepositorName: string,
  bankAmt: number,
  remitterName: string,
  paymentExpirationYmdt: string,
  totalStandardAmt: number,
  totalDeliveryAmt: number,
  totalDiscountAmt: number,
  subPayAmt: number,
  chargeAmt: number,
  accumulationAmtWhenBuyConfirm: number,
};

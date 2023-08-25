import { number, string, object } from 'prop-types';

import { convertToKoreanCurrency } from '@shopby/shared';

import ClaimOrderOptionLabel from './ClaimOrderOptionLabel';

const ClaimDetailAdditionalPayInfo = ({
  exchangeOrderOption,
  exchangeProductTotalAmt,
  exchangeDeliveryAmt,
  exchangePayAmt,
  subtractionTotalAmt,
  payTypeLabel,
}) => (
  <section className="l-panel">
    <p className="order-detail__section-title">추가 결제 정보</p>
    <dl className="order-detail__section-content">
      <dt>교환 출고 상품</dt>
      <dd>
        <ClaimOrderOptionLabel claimOrderOption={exchangeOrderOption} />
      </dd>
      <dt>교환 상품 금액</dt>
      <dd>{convertToKoreanCurrency(exchangeProductTotalAmt)}원</dd>
      <dt>반품/교환 배송비</dt>
      <dd>{convertToKoreanCurrency(exchangeDeliveryAmt)}원</dd>
      <dt>차감 금액</dt>
      <dd>{convertToKoreanCurrency(subtractionTotalAmt)}원</dd>
      <dt>추가 결제 금액</dt>
      <dd>{convertToKoreanCurrency(exchangePayAmt)}원</dd>
      <dt>결제 수단</dt>
      <dd>{payTypeLabel}</dd>
    </dl>
  </section>
);

export default ClaimDetailAdditionalPayInfo;

ClaimDetailAdditionalPayInfo.propTypes = {
  exchangeOrderOption: object,
  exchangeProductTotalAmt: number,
  exchangeDeliveryAmt: number,
  exchangePayAmt: number,
  subtractionTotalAmt: number,
  payTypeLabel: string,
};

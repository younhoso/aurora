import { string, object } from 'prop-types';

import ClaimOrderOptionLabel from './ClaimOrderOptionLabel';

const ClaimDetailExchangeDeliveryInfo = ({
  exchangeOrderOption,
  receiverName,
  receiverAddress,
  receiverMobilePhoneNumber,
  deliveryMemo,
  customsId,
}) => (
  <section className="l-panel">
    <p className="order-detail__section-title">교환 출고 정보</p>
    <dl className="order-detail__section-content">
      <dt>교환 출고 상품</dt>
      <dd>
        <ClaimOrderOptionLabel claimOrderOption={exchangeOrderOption} />
      </dd>
      <dt>수령자명</dt>
      <dd>{receiverName}</dd>
      <dt>배송지 주소</dt>
      <dd>{receiverAddress}</dd>
      <dt>휴대폰 번호</dt>
      <dd>{receiverMobilePhoneNumber}</dd>
      <dt>배송 메시지</dt>
      <dd>{deliveryMemo}</dd>
      {customsId && (
        <>
          <dt>개인통관고유부호</dt>
          <dd>{customsId}</dd>
        </>
      )}
    </dl>
  </section>
);

export default ClaimDetailExchangeDeliveryInfo;

ClaimDetailExchangeDeliveryInfo.propTypes = {
  exchangeOrderOption: object,
  receiverName: string,
  receiverAddress: string,
  receiverMobilePhoneNumber: string,
  deliveryMemo: string,
  customsId: string,
};

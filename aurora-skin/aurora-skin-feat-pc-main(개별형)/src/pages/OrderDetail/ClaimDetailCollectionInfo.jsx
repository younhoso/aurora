import { string, oneOfType } from 'prop-types';

import { RETURN_WAY_TYPE_MAP } from '@shopby/shared';

const ClaimDetailCollectionInfo = ({
  returnWay,
  returnerName,
  returnerMobilePhoneNumber,
  returnerPhoneNumber,
  returnNote,
  returnAddress,
}) => {
  if (returnWay === 'BUYER_DIRECT_RETURN')
    return (
      <section className="l-panel">
        <p className="order-detail__section-title">반품 수거 정보</p>
        <dl className="order-detail__section-content">
          <dt>반품 수거 방법</dt>
          <dd>{RETURN_WAY_TYPE_MAP[returnWay]}</dd>
          <dt>반품 접수 정보</dt>
          <dd>{returnNote}</dd>
        </dl>
      </section>
    );

  return (
    <section className="l-panel">
      <p className="order-detail__section-title">반품 수거 정보</p>
      <dl className="order-detail__section-content">
        <dt>반품 수거 방법</dt>
        <dd>{RETURN_WAY_TYPE_MAP[returnWay]}</dd>
        <dt>반품자명</dt>
        <dd>{returnerName}</dd>
        <dt>수거지 주소</dt>
        <dd>{returnAddress}</dd>
        <dt>휴대폰 번호</dt>
        <dd>{returnerMobilePhoneNumber}</dd>
        <dt>전화 번호</dt>
        <dd>{returnerPhoneNumber}</dd>
        <dt>수거 시 참고사항</dt>
        <dd>{returnNote}</dd>
      </dl>
    </section>
  );
};

export default ClaimDetailCollectionInfo;

ClaimDetailCollectionInfo.propTypes = {
  returnWay: oneOfType(['BUYER_DIRECT_RETURN', 'SELLER_COLLECT']),
  returnerName: string,
  returnerMobilePhoneNumber: string,
  returnerPhoneNumber: string,
  returnNote: string,
  returnAddress: string,
};

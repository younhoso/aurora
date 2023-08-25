import { string } from 'prop-types';

import { Accordion } from '@shopby/react-components';

const OrderDetailAddressInfo = ({
  receiverName = '',
  receiverZipCd = '',
  receiverAddress = '',
  receiverDetailAddress = '',
  receiverMobilePhoneNumber = '',
  receiverPhoneNumber,
  deliveryMemo,
}) => (
  <section className="l-panel order-detail-info">
    <Accordion title="배송지" isOpen={true}>
      <dl>
        <dt>받는 사람</dt>
        <dd>{receiverName}</dd>
        <dt>주소</dt>
        <dd>{`(${receiverZipCd}) ${receiverAddress} ${receiverDetailAddress}`}</dd>
        <dt>휴대폰 번호</dt>
        <dd>{receiverMobilePhoneNumber}</dd>
        {receiverPhoneNumber && (
          <>
            <dt>전화 번호</dt>
            <dd>{receiverPhoneNumber}</dd>
          </>
        )}
        {deliveryMemo && (
          <>
            <dt>배송 메모</dt>
            <dd>{deliveryMemo}</dd>
          </>
        )}
      </dl>
    </Accordion>
  </section>
);

export default OrderDetailAddressInfo;

OrderDetailAddressInfo.propTypes = {
  receiverName: string,
  receiverZipCd: string,
  receiverAddress: string,
  receiverDetailAddress: string,
  receiverMobilePhoneNumber: string,
  receiverPhoneNumber: string,
  deliveryMemo: string,
};

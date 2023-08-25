import { string } from 'prop-types';

import { Accordion } from '@shopby/react-components';

const OrderDetailOrdererInfo = ({ ordererName, ordererEmail, ordererMobilePhoneNumber }) => (
  <section className="l-panel order-detail-info">
    <Accordion title="주문자 정보" isOpen={true}>
      <dl>
        <dt>주문자 명</dt>
        <dd>{ordererName}</dd>
        <dt>이메일</dt>
        <dd>{ordererEmail}</dd>
        <dt>휴대폰 번호</dt>
        <dd>{ordererMobilePhoneNumber}</dd>
      </dl>
    </Accordion>
  </section>
);

export default OrderDetailOrdererInfo;

OrderDetailOrdererInfo.propTypes = {
  ordererName: string,
  ordererEmail: string,
  ordererMobilePhoneNumber: string,
};

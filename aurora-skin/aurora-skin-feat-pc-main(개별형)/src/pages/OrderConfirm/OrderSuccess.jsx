import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { object, string } from 'prop-types';

import { Button, Icon, useAuthActionContext, usePageScriptsActionContext } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';
import { deliverableProduct } from '../../utils';

import OrdererInfo from './OrdererInfo';
import OrderProductTable from './OrderProductTable';
import PaymentInfo from './PaymentInfo';
import ShippingAddressInfo from './ShippingAddressInfo';

const OrderSuccess = ({ orderInfo, orderNo }) => {
  const [searchParams] = useSearchParams();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { isSignedIn } = useAuthActionContext();
  const navigate = useNavigate();

  useLayoutChanger({
    title: '주문완료',
    hasCancelBtnOnHeader: true,
  });

  useEffect(() => {
    applyPageScripts('ORDER_COMPLETE', { order: orderInfo });
  }, []);

  const handleSearchOrdersBtnClick = () => {
    navigate(isSignedIn() ? `/orders/${orderNo}` : '/sign-in');
  };

  const handleContinueBtnClick = () => {
    navigate('/');
  };

  return (
    <div className="order-confirm">
      <section className="l-panel order-confirm__message">
        <span className="order-confirm__hero">
          <Icon name="delivery" />
        </span>
        <p>주문이 정상적으로 완료되었습니다.</p>
        <p className="order-confirm__sub-message">
          {orderInfo.orderer.ordererName} 고객님의 주문하신 결제가 완료되었습니다.
        </p>
        <span className="order-confirm__order-no">
          주문번호 | <span className="bold">{orderNo}</span>
        </span>
      </section>

      <OrderProductTable />
      <OrdererInfo />
      {deliverableProduct(searchParams) && <ShippingAddressInfo />}
      <PaymentInfo />

      <section className="order-confirm__btn-group">
        <Button label="주문내역 조회" onClick={handleSearchOrdersBtnClick} />
        <Button className="order-confirm__continue-btn" label="계속 쇼핑하기" onClick={handleContinueBtnClick} />
      </section>
    </div>
  );
};

export default OrderSuccess;

OrderSuccess.propTypes = {
  orderInfo: object.isRequired,
  orderNo: string.isRequired,
};

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { string } from 'prop-types';

import { Button, useMallStateContext } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

const OrderFail = ({ message }) => {
  const { mall } = useMallStateContext();
  const navigate = useNavigate();

  const {
    failCode = '',
    summary = '',
    description = '',
  } = useMemo(() => {
    if (!message) return {};

    const failCodeWithBrackets = message.match(/\[(.*?)\]/)?.[0];
    const failCode = failCodeWithBrackets?.slice(1, -1) ?? '';

    const failMessageWithoutCode = message.slice(message.indexOf(']') + 1);
    const [summary, description] = failMessageWithoutCode.split(':');

    return {
      failCode,
      summary,
      description,
    };
  }, [message]);

  useLayoutChanger({
    title: '결제실패',
  });

  const handleGoCartBtnClick = () => {
    navigate('/cart');
  };

  const handleGoHomeBtnClick = () => {
    navigate('/');
  };

  return (
    <div className="order-confirm">
      <section className="l-panel order-confirm__message">
        <p className="order-confirm__message bold">
          [{failCode}] {summary}
        </p>
        <p>{description}</p>
        <p className="order-confirm__sub-message order-confirm__sub-message--fail">
          실패 사유를 확인하신 후 &apos;장바구니 가기&apos; 또는 &apos;홈으로 가기&apos; 버튼을 통해 주문/결제를 다시
          시도하시거나, 계속 실패되시는 경우 {mall?.serviceCenter?.phoneNo ?? '고객센터'}로 문의주시기 바랍니다.
        </p>
      </section>
      <section className="order-confirm__btn-group">
        <Button label="장바구니 가기" onClick={handleGoCartBtnClick} />
        <Button className="order-confirm__go-home-btn" label="홈으로 가기" onClick={handleGoHomeBtnClick} />
      </section>
    </div>
  );
};

export default OrderFail;

OrderFail.propTypes = {
  message: string,
};

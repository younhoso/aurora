import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import { OrderConfirmProvider, useOrderConfirmStateContext } from '@shopby/react-components';

import OrderFail from './OrderFail';
import OrderSuccess from './OrderSuccess';

const OrderConfirmContent = () => {
  const { orderInfo, orderNo, message, isSuccess } = useOrderConfirmStateContext();

  useEffect(() => {
    if (!isMobile && opener) {
      opener.location.href = self.location.href;
      setTimeout(() => {
        self.close();
      }, 500);
    }
  }, []);

  if (!isSuccess) {
    return <OrderFail message={message} />;
  }

  if (!orderInfo) return <></>;

  return <OrderSuccess orderInfo={orderInfo} orderNo={orderNo} />;
};

const OrderConfirm = () => (
  <OrderConfirmProvider>
    <OrderConfirmContent />
  </OrderConfirmProvider>
);

export default OrderConfirm;

import { useOrderConfirmStateContext } from '@shopby/react-components';

import OrderDetailOrdererInfo from '../../components/OrderDetailOrdererInfo';

const OrdererInfo = () => {
  const {
    orderInfo: {
      orderer: { ordererName, ordererEmail, ordererContact1 },
    },
  } = useOrderConfirmStateContext();

  return (
    <OrderDetailOrdererInfo
      ordererName={ordererName}
      ordererEmail={ordererEmail}
      ordererMobilePhoneNumber={ordererContact1}
    />
  );
};

export default OrdererInfo;

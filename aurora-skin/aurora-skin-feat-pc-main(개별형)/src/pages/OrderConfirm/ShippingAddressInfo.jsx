import { useOrderConfirmStateContext } from '@shopby/react-components';

import OrderDetailAddressInfo from '../../components/OrderDetailAddressInfo';

const ShippingAddressInfo = () => {
  const {
    orderInfo: {
      shippingAddress: {
        receiverName,
        receiverZipCd,
        receiverAddress,
        receiverDetailAddress,
        receiverContact1,
        receiverContact2,
      },
      deliveryMemo,
    },
  } = useOrderConfirmStateContext();

  return (
    <OrderDetailAddressInfo
      receiverName={receiverName}
      receiverZipCd={receiverZipCd}
      receiverAddress={receiverAddress}
      receiverDetailAddress={receiverDetailAddress}
      receiverMobilePhoneNumber={receiverContact1}
      receiverPhoneNumber={receiverContact2}
      deliveryMemo={deliveryMemo}
    />
  );
};

export default ShippingAddressInfo;

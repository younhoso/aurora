import { MyShippingAddressProvider } from '@shopby/react-components';

import useLayoutChanger from '../../../hooks/useLayoutChanger';

import ShippingAddressCount from './ShippingAddressCount';
import ShippingAddressList from './ShippingAddressList';

const ShippingAddress = () => {
  useLayoutChanger({
    title: '배송지 관리',
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <MyShippingAddressProvider>
      <div className="profile-shipping-address">
        <ShippingAddressCount />
        <ShippingAddressList />
      </div>
    </MyShippingAddressProvider>
  );
};

export default ShippingAddress;

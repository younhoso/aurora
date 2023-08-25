import { number } from 'prop-types';

import { useMyShippingAddressStateContext } from '@shopby/react-components';

import TotalCount from '../TotalCount';

const ShippingAddressCount = () => {
  const { bookedAddresses } = useMyShippingAddressStateContext();

  return <TotalCount title="배송지" count={bookedAddresses.length} />;
};

ShippingAddressCount.propTypes = {
  totalCount: number,
};

export default ShippingAddressCount;

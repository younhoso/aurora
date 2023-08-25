import { useProductDetailStateContext } from '@shopby/react-components';

import AccumulationInformation from './AccumulationInformation';
import DownloadCouponButton from './DownloadCouponButton';
import FreightInformation from './FreightInformation';
import PriceInformation from './PriceInformation';

const Summary = () => {
  const {
    productDetail: { summary },
  } = useProductDetailStateContext();

  return (
    <div className="product-summary">
      <p className="product-summary__brand-name">{summary.brandName}</p>
      <h2 className="product-summary__title">{summary.productName}</h2>
      <div className="product-summary__price-info">
        <PriceInformation {...summary} />
        <DownloadCouponButton />
      </div>
      <div className="product-summary__freight-line">
        <FreightInformation {...summary.freight} />
        <AccumulationInformation {...summary.accumulation} />
      </div>
    </div>
  );
};
export default Summary;

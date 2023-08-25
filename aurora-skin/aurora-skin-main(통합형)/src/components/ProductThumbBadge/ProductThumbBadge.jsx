import { useMemo } from 'react';

import { oneOf, bool } from 'prop-types';

import { Badge } from '@shopby/react-components';
import { PURCHASE_OPTION_SALE_LABEL, SALE_STATUS_TYPE } from '@shopby/shared';

const ProductThumbBadge = ({ saleStatusType, isSoldOut }) => {
  const badgeColorType = useMemo(() => (saleStatusType === 'FINISHED' ? 'primary' : 'caution'), []);

  if (saleStatusType === 'ONSALE' && !isSoldOut) return <></>;

  return (
    <span className="thumb-item-badges">
      {(saleStatusType === 'FINISHED' || saleStatusType === 'READY') && (
        <Badge
          className="product-card__badge product-card__badge-sale-status"
          colorType={badgeColorType}
          label={SALE_STATUS_TYPE[saleStatusType]}
        />
      )}
      {isSoldOut && (
        <Badge label={PURCHASE_OPTION_SALE_LABEL.SOLD_OUT} colorType="primary" className="product-card__badge" />
      )}
    </span>
  );
};

export default ProductThumbBadge;

ProductThumbBadge.propTypes = {
  saleStatusType: oneOf(['READY', 'ONSALE', 'FINISHED', 'STOP', 'PROHIBITION']),
  isSoldOut: bool,
};

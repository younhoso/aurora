import { useMemo } from 'react';

import { VisibleComponent, useProductDetailStateContext } from '@shopby/react-components';

import Sanitized from '../../../components/Sanitized';

const TITLE_MAP = {
  freight: '배송안내',
  exchange: '교환 및 반품안내',
  refund: '환불 안내',
  afterService: 'AS 안내',
};

const ShippingClaim = () => {
  const {
    productDetail: { guide },
  } = useProductDetailStateContext();

  const guideContents = useMemo(
    () =>
      Object.entries(guide)
        .map(([titleKey, content]) => ({
          titleKey,
          content,
        }))
        .filter(({ content }) => Boolean(content)),
    [guide]
  );

  return (
    <>
      {
        <VisibleComponent
          shows={guideContents.length > 0}
          TruthyComponent={
            <div className="product-content-shipping-claim">
              {guideContents.map(({ titleKey, content }) => (
                <div key={`shipping-claim-${titleKey}`}>
                  <p className="product-content__title">{TITLE_MAP[titleKey]}</p>
                  <Sanitized html={content} />
                </div>
              ))}
            </div>
          }
          FalsyComponent={
            <div className="empty-list">
              <p>등록된 배송/교환/반품/AS 정보가 없습니다.</p>
            </div>
          }
        />
      }
    </>
  );
};

export default ShippingClaim;

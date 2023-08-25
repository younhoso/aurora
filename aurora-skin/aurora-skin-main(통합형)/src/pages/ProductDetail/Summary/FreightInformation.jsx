import { useMemo } from 'react';

import { string, bool, number, shape, arrayOf, oneOf } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared/utils';

const getConditionLabel = (freight, conditionType) => {
  if (conditionType === 'QUANTITY_PROPOSITIONAL_FEE') return `(${freight.perOrderCnt}개마다 부과)`;

  if (freight.aboveDeliveryAmt > 0) return `(${convertToKoreanCurrency(freight.aboveDeliveryAmt)}원 이상 구매 시 무료)`;

  return '';
};

const getFeeLabel = (freight, conditionType) => {
  if (conditionType === 'FREE') return '무료배송';

  const feeLabel = `${convertToKoreanCurrency(freight.fee)}원`;

  return conditionType === 'FIXED_FEE' ? `배송비 ${feeLabel}` : feeLabel;
};

const FreightInformation = ({ areaType, partnerCompanyName, canFreight, conditionType, ...freight }) => {
  const feeLabel = useMemo(() => getFeeLabel(freight, conditionType), [conditionType]);

  const conditionLabel = useMemo(() => getConditionLabel(freight, conditionType), [conditionType]);

  return (
    <dl className="product-summary__freight">
      <dt>
        <span className="ico ico--shipping-car"></span>
        <VisibleComponent
          shows={areaType === 'PARTNER_SHIPPING_AREA'}
          TruthyComponent={
            <>
              <strong>{partnerCompanyName}</strong> 배송
            </>
          }
        />
      </dt>
      <dd className={`product-summary__display-label${canFreight ? '' : ' product-summary__display-label--unable'}`}>
        <span className="a11y">배송비</span>
        {feeLabel}
        <VisibleComponent shows={!!conditionLabel} TruthyComponent={<em>{conditionLabel}</em>} />
      </dd>
    </dl>
  );
};

FreightInformation.propTypes = {
  type: oneOf([string, 'PARCEL_DELIVERY', 'DIRECT_DELIVERY', 'NONE']),
  areaType: oneOf(['PARTNER_SHIPPING_AREA', 'MALL_SHIPPING_AREA']),
  partnerCompanyName: string,
  canFreight: bool,
  canInternationalFreight: bool,
  fee: number,
  isPrePayment: bool,
  conditionType: oneOf(['FREE', 'CONDITIONAL', 'FIXED_FEE', 'QUANTITY_PROPOSITIONAL_FEE', 'PRICE_FEE', 'QUANTITY_FEE']),
  aboveDeliveryAmt: number,
  conditionLabel: string,
  companyType: string,
  companyTypeLabel: string,
  defaultConditionLabel: string,
  remoteDeliveryAreaFee: shape({
    address: string,
    extraDeliveryAmt: number,
  }),
  feeLabels: arrayOf(string),
  conditionDetails: arrayOf(string),
  perOrderCnt: number,
  customerGuidance: string,
  returnFee: number,
  returnWarehouse: shape({
    warehouseAddressType: oneOf(['ADDRESS', 'SUBSTITUTION']),
    partnerNo: number,
    addressStr: string,
    address: string,
    countryCd: string,
    isDefaultReleaseWarehouse: bool,
    isDefaultReturnWarehouse: bool,
    detailAddress: string,
    zipCd: string,
    warehouseName: string,
    warehouseNo: number,
  }),
};

export default FreightInformation;

import { string, number, arrayOf, shape, bool, func } from 'prop-types';

import { QuantityChanger, ThumbItem, VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import OptionLabel from '../OptionLabel';

const ProductThumbItem = ({
  productNo = 0,
  imageUrl = '',
  brandName = '',
  productName = '',
  orderCnt,
  buyAmt,
  optionName = '',
  optionValue = '',
  optionInputs = [],
  usesQuantityChanger,
  quantityChangerValue,
  onQuantityChange,
  frontDisplayYn = 'Y',
  OptionComponent = null,
  AmountComponent = null,
  isRedirectingDisabled = false,
}) => {
  if (!frontDisplayYn) return <></>;

  return (
    <ThumbItem
      href={isRedirectingDisabled ? '#' : `/product-detail?productNo=${productNo}`}
      src={imageUrl}
      className="product-thumb-item"
      alt={productName}
    >
      <VisibleComponent shows={brandName} TruthyComponent={<p className="product-thumb-item__brand">{brandName}</p>} />
      <div>
        <p className="product-thumb-item__name">{productName}</p>
        <VisibleComponent
          shows={optionName || optionInputs.length > 0}
          TruthyComponent={
            <OptionLabel optionName={optionName} optionValue={optionValue} optionInputs={optionInputs} />
          }
        />
        {OptionComponent && <OptionComponent />}
      </div>
      <div className="product-thumb-item__amount-wrap">
        <ul className="product-thumb-item__amount">
          {orderCnt >= 0 && <li>{orderCnt}개 </li>}
          {buyAmt >= 0 && <li>{convertToKoreanCurrency(buyAmt)}원</li>}
        </ul>
        {AmountComponent && <AmountComponent />}
        {usesQuantityChanger && <QuantityChanger value={quantityChangerValue} onChange={onQuantityChange} />}
      </div>
    </ThumbItem>
  );
};
export default ProductThumbItem;

ProductThumbItem.propTypes = {
  frontDisplayYn: bool,
  brandName: string,
  productName: string.isRequired,
  orderCnt: number,
  buyAmt: number,
  imageUrl: string,
  optionName: string,
  optionValue: string,
  optionInputs: arrayOf(
    shape({
      inputLabel: string,
      inputValue: string,
    })
  ),
  productNo: number,
  OptionComponent: func,
  AmountComponent: func,
  usesQuantityChanger: bool,
  quantityChangerValue: number,
  onQuantityChange: func,
  isRedirectingDisabled: bool,
};

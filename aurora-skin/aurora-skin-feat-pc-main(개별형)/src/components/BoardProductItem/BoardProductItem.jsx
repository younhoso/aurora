import { string, arrayOf, shape, func, oneOf, number } from 'prop-types';

import { VisibleComponent, SelectBox } from '@shopby/react-components';

import { BOARD_IMAGE } from '../../constants/image';

const BoardProductItem = ({
  productName,
  productImageUrl,
  options = [],
  onSelect,
  optionDisplayLabel,
  optionNo,
  className = '',
}) => {
  const handleOptionSelect = ({ currentTarget: { value } }) => {
    const selectedOptionNo = Number(value);

    selectedOptionNo > 0 && onSelect?.(selectedOptionNo);
  };

  return (
    <div className={`l-panel board-product-item__description ${className}`}>
      <div className="board-product-item__image">
        <img src={`${productImageUrl}?${BOARD_IMAGE.THUMB_NAIL_SIZE}`} alt={productName} loading="lazy" />
      </div>
      <div className="board-product-item__product">
        <em className="board-product-item__product-name">{productName}</em>
        <VisibleComponent
          shows={options?.length > 1}
          TruthyComponent={
            <SelectBox
              onSelect={handleOptionSelect}
              options={options}
              value={optionNo}
              className="board-product-item__option-selector"
            />
          }
          FalsyComponent={<p className={`board-product-item__option-value`}>{optionDisplayLabel}</p>}
        />
      </div>
    </div>
  );
};

export default BoardProductItem;

BoardProductItem.propTypes = {
  productName: string.isRequired,
  productImageUrl: string.isRequired,
  options: arrayOf(
    shape({
      value: oneOf(['string', 'number']),
      label: string,
    })
  ),
  onSelect: func,
  optionDisplayLabel: string,
  optionNo: number,
  className: string,
};

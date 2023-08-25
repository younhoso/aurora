import { oneOf, arrayOf, shape, number, string, func } from 'prop-types';

import { SelectBox } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

const TotalCountAndSort = ({ totalCount, sortType, updateSortType, sortBy }) => (
  <div className="total-sort">
    <p className="total-sort__count">
      총 <em className="highlight">{convertToKoreanCurrency(totalCount)}</em>개
    </p>
    <SelectBox
      className="total-sort__select-box"
      hasSortOption={true}
      value={sortType}
      onSelect={({ target }) => updateSortType(target.value)}
      options={sortBy}
    />
  </div>
);
export default TotalCountAndSort;

TotalCountAndSort.propTypes = {
  totalCount: number,
  sortType: oneOf([
    'SALE',
    'LOW_PRICE',
    'HIGH_PRICE',
    'REVIEW',
    'REGISTER',
    'POPULAR',
    'SALE_YMD',
    'SALE_END_YMD',
    'DISCOUNTED_PRICE',
    'REVIEW',
    'SALE_CNT',
    'RECENT_PRODUCT',
    'MD_RECOMMEND',
    'LIKE_CNT',
    'ADMIN_SETTING',
    'BEST_SELLER',
    'BEST_REVIEW',
  ]),
  updateSortType: func,
  sortBy: arrayOf(
    shape({
      value: oneOf([
        'SALE',
        'LOW_PRICE',
        'HIGH_PRICE',
        'REVIEW',
        'REGISTER',
        'POPULAR',
        'SALE_YMD',
        'SALE_END_YMD',
        'DISCOUNTED_PRICE',
        'REVIEW',
        'SALE_CNT',
        'RECENT_PRODUCT',
        'MD_RECOMMEND',
        'LIKE_CNT',
        'ADMIN_SETTING',
        'BEST_SELLER',
        'BEST_REVIEW',
      ]),
      label: string,
    })
  ),
};

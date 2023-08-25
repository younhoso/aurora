import { string, number } from 'prop-types';

import { convertToKoreanCurrency } from '@shopby/shared';

const TotalCount = ({ title, count }) => (
  <p className="my-page__total-count">
    {title}
    <span className="my-page__count">
      <span>{convertToKoreanCurrency(count)}</span> 건
    </span>
  </p>
);

TotalCount.propTypes = {
  title: string,
  count: number,
};

export default TotalCount;

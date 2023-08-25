import { RatingStar, useProductReviewStateContext } from '@shopby/react-components';

import ReviewAccumulation from '../../../components/ReviewAccumulation';
import { RATING_STAR } from '../../../constants/rate';

const Summary = () => {
  // state context
  const { rate } = useProductReviewStateContext();

  return (
    <div className="product-review-summary">
      <p className="product-review-summary__title">상품후기</p>
      <span className="product-review-summary__rating">
        <RatingStar score={rate} limit={RATING_STAR.LIMIT_SCORE} />
        <span className="product-review-summary__score">
          {rate} <span>/{RATING_STAR.LIMIT_SCORE}</span>
        </span>
      </span>
      <ReviewAccumulation />
    </div>
  );
};

export default Summary;

import { useMemo } from 'react';

import { string, bool } from 'prop-types';

import { VisibleComponent, useMallStateContext } from '@shopby/react-components';

const REVIEW_ACCUMULATION_LABEL = {
  reviewsAccumulation: '텍스트후기',
  photoReviewsAccumulation: '포토후기',
};

const ReviewAccumulation = ({ className = '', showsIcon = true }) => {
  const {
    accumulationConfig: { reviewsAccumulationDetail, unit, useReviewsAccumulation },
  } = useMallStateContext();

  const accumulations = useMemo(
    () => Object.entries(reviewsAccumulationDetail).filter(([key]) => REVIEW_ACCUMULATION_LABEL[key]),
    [reviewsAccumulationDetail]
  );

  const accumulationLength = useMemo(() => accumulations.length, [accumulations]);

  if (!useReviewsAccumulation) return <></>;

  return (
    <span className={`review-accumulation ${className ?? ''}`}>
      <VisibleComponent shows={showsIcon} TruthyComponent={<span className="ico ico--p-circle" />} />
      {accumulations.map(([key, value], index) => {
        const label = REVIEW_ACCUMULATION_LABEL[key];

        return (
          <span className="review-accumulation__point" key={`${index}_${label}_review-summary`}>
            {label} <em>{value}</em> {unit}
            {index === accumulationLength - 1 ? '적립' : ' / '}
          </span>
        );
      })}
    </span>
  );
};

ReviewAccumulation.propTypes = {
  className: string,
  showsIcon: bool,
};

export default ReviewAccumulation;

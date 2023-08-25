import { memo } from 'react';

import { oneOf, func, arrayOf, shape, bool, number, string } from 'prop-types';

import { SelectBox, ThumbList, VisibleComponent, useBoardConfigurationContextState } from '@shopby/react-components';

import ListSkeleton from '../ListSkeleton/ListSkeleton';
import ProductThumbItem from '../ProductThumbItem';
import ReviewAccumulation from '../ReviewAccumulation/ReviewAccumulation';

import ProductReviewItem from './ProductReviewItem';

const EmptyReviewList = memo(() => (
  <div className="product-board-list__empty">
    <span className="ico ico--exclamation-white-bg"></span>
    <span className="product-board-list__empty-notes">아직 작성 된 상품후기가 없어요.</span>
    <p className="product-board-list__accumulation-notes">
      구매 후 상품후기를 남겨주세요!
      <br />
      <ReviewAccumulation className="product-board-list__accumulation" showsIcon={false} />
    </p>
  </div>
));

EmptyReviewList.displayName = 'EmptyReviewList';

const REVIEW_SORT_TYPE_MAP = {
  BEST_REVIEW: '베스트순',
  REGISTER_YMDT: '등록일순',
  RATING_DESC: '평점높은순',
  RATING_ASC: '평점낮은순',
};

const getOptionDisplayLabel = ({ optionUsed = true, optionName = '', optionValue = '' } = {}) =>
  optionUsed && optionName && optionValue ? `${optionName} : ${optionValue}` : '';

export const ReviewList = ({ reviews = [], onModify, onDelete, showsProductInfo = false }) => (
  <div className="product-board-list__items">
    <ul>
      {reviews.map(({ fileUrls, ...review }) => {
        const { orderedOption } = review;
        const optionDisplayLabel = getOptionDisplayLabel(orderedOption);
        return (
          <ThumbList key={review.reviewNo}>
            {showsProductInfo && (
              <ProductThumbItem
                {...review}
                optionName={orderedOption.optionName}
                optionValue={orderedOption.optionValue}
              />
            )}
            <ProductReviewItem
              {...review}
              productName={review.productName}
              updatedDate={review.registerYmdt.slice(0, 10)}
              mainImageUrl={review.imageUrl}
              brandName={showsProductInfo ? '' : review.brandName}
              optionDisplayLabel={showsProductInfo ? '' : optionDisplayLabel}
              showsProductName={!showsProductInfo}
              isMine={review.myReview}
              images={fileUrls}
              onModify={onModify}
              onDelete={onDelete}
            />
          </ThumbList>
        );
      })}
    </ul>
  </div>
);

ReviewList.propTypes = {
  onModify: func.isRequired,
  onDelete: func.isRequired,
  reviews: arrayOf(
    shape({
      reviewNo: number.isRequired,
      memberId: string.isRequired,
      updatedDate: string,
      content: string,
      fileUrls: arrayOf(string),
      rate: number,
      orderedOption: shape({
        optionName: string,
        optionValue: string,
      }),
      myReview: bool,
    })
  ),
  showsProductInfo: bool,
};

const ProductReviewList = ({ productNo, totalCount, sortType, onSelect, reviews, onModify, onDelete, isLoading }) => {
  const {
    boardConfig: { productReviewConfig },
  } = useBoardConfigurationContextState();

  const handleSortTypeSelect = (event) => {
    onSelect(event);
  };

  const handleReviewFormModify = () => {
    onModify();
  };

  const handleReviewFormDelete = () => {
    onDelete();
  };

  return (
    <div className="product-board-list">
      <div className="product-board-list__search">
        <p>
          {productReviewConfig?.name ?? '상품후기'}{' '}
          <span className="product-board-list__total-count">
            <em>{totalCount}</em>건
          </span>
        </p>
        <SelectBox
          value={sortType}
          className="product-board-list__sort-type"
          options={Object.entries(REVIEW_SORT_TYPE_MAP).map(([value, label]) => ({
            value,
            label,
          }))}
          onSelect={handleSortTypeSelect}
        />
      </div>
      <VisibleComponent
        shows={totalCount > 0}
        TruthyComponent={
          <>
            <ReviewList
              productNo={productNo}
              reviews={reviews}
              sortType={sortType}
              onModify={handleReviewFormModify}
              onDelete={handleReviewFormDelete}
            />
            <ListSkeleton isLoading={isLoading} />
          </>
        }
        FalsyComponent={isLoading ? <ListSkeleton isLoading={isLoading} /> : <EmptyReviewList />}
      />
    </div>
  );
};

export default ProductReviewList;

ProductReviewList.displayName = 'ProductReviewList';

ProductReviewList.propTypes = {
  productNo: number.isRequired,
  totalCount: number.isRequired,
  sortType: oneOf(['BEST_REVIEW', 'REGISTER_YMDT', 'RATING_DESC', 'RATING_ASC']).isRequired,
  onSelect: func.isRequired,
  onModify: func.isRequired,
  onDelete: func.isRequired,
  reviews: arrayOf(
    shape({
      reviewNo: number.isRequired,
      memberId: string.isRequired,
      updatedDate: string,
      content: string,
      fileUrls: arrayOf(string),
      rate: number,
      orderedOption: shape({
        optionName: string,
        optionValue: string,
      }),
      myReview: bool,
      onEditBtnClick: func,
      onDeleteBtnClick: func,
    })
  ).isRequired,
  isLoading: bool,
};

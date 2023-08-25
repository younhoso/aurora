import { useEffect } from 'react';

import {
  InfiniteScrollLoader,
  VisibleComponent,
  useInfiniteScroll,
  useProductReviewStateContext,
  useProfileProductReviewActionContext,
  useProfileProductReviewStateContext,
} from '@shopby/react-components';

import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import { ReviewList } from '../../../components/ProductReviewList/ProductReviewList';
import TotalCount from '../TotalCount';

const ReviewedProductTotalCount = () => {
  const {
    reviewedProduct: { totalCount },
  } = useProfileProductReviewStateContext();

  return <TotalCount title="작성 완료 후기" count={totalCount} />;
};

const EmptyReviewedProduct = () => (
  <div className="empty-list">
    <p>작성완료 리뷰가 없습니다.</p>
  </div>
);

const ProductReviewedList = () => {
  // state
  const {
    reviewedProduct: { totalCount },
  } = useProfileProductReviewStateContext();
  const { reviewConfig } = useProductReviewStateContext();

  // action
  const { fetchProfileReviewedProducts } = useProfileProductReviewActionContext();

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (param) => {
      const { data } = await fetchProfileReviewedProducts(param);

      return data.items.map((item) => ({
        ...item,
        memberId: '',
        myReview: true,
      }));
    },
  });

  const resetReviewedProducts = () => {
    fetchInitialItems();
  };

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  useEffect(() => {
    reviewConfig?.expandedReviewConfig && resetReviewedProducts();
  }, [reviewConfig?.expandedReviewConfig?.allReviewCntPerPage]);

  return (
    <div className="profile-list">
      <ReviewedProductTotalCount />
      <VisibleComponent
        shows={totalCount > 0}
        TruthyComponent={
          <>
            <ReviewList
              reviews={accumulativeItems}
              onModify={resetReviewedProducts}
              onDelete={resetReviewedProducts}
              showsProductInfo={true}
            />
            <ListSkeleton isLoading={isLoading} className="product-board-list__items" />
          </>
        }
        FalsyComponent={
          isLoading ? (
            <ListSkeleton isLoading={isLoading} className="product-board-list__items" />
          ) : (
            <EmptyReviewedProduct />
          )
        }
      />
      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
      />
    </div>
  );
};

export default ProductReviewedList;

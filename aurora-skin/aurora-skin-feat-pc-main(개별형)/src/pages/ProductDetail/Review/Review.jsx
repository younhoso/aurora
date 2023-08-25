import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  VisibleComponent,
  ProductReviewFormProvider,
  useProductReviewStateContext,
  useProductReviewActionContext,
  useInfiniteScroll,
  InfiniteScrollLoader,
} from '@shopby/react-components';

import ProductReviewList from '../../../components/ProductReviewList';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../../constants/common';

import Summary from './Summary';

const Review = () => {
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));

  const { totalCount, reviewConfig } = useProductReviewStateContext();

  const [sortType, setSortType] = useState('BEST_REVIEW');
  const { searchReviews } = useProductReviewActionContext();

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (param) => {
      const { data } = await searchReviews(param);

      return data.items;
    },
    requestOption: {
      pageNumber: 1,
      pageSize: reviewConfig?.expandedReviewConfig?.productReviewCntPerPage ?? INFINITY_SCROLL_PAGE_SIZE,
      sortType,
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  const handleOrderBySelect = ({ target }) => {
    setSortType(target.value);
  };

  const resetReviews = () => {
    fetchInitialItems({
      requestOption: {
        pageSize: reviewConfig?.expandedReviewConfig?.productReviewCntPerPage ?? INFINITY_SCROLL_PAGE_SIZE,
      },
    });
  };

  const sortOption = useMemo(() => {
    const shouldSortByRate = sortType?.includes('RATING');
    const _sortType = shouldSortByRate ? sortType.split('_').at(0) : sortType;
    const sortDirectionType = sortType?.split('_')?.at(-1) === 'DESC' ? 'DESC' : 'ASC';

    return {
      sortType: _sortType,
      sortDirectionType: shouldSortByRate ? sortDirectionType : 'DESC',
    };
  }, [sortType]);

  useEffect(() => {
    fetchInitialItems({
      requestOption: {
        sortType: sortOption.sortType,
        sortDirectionType: sortOption.sortDirectionType,
      },
    });
  }, [sortType]);

  return (
    <div className="product-content-review">
      <ProductReviewFormProvider>
        <Summary />
        <ProductReviewList
          isLoading={isLoading}
          productNo={productNo}
          reviews={accumulativeItems}
          totalCount={totalCount}
          sortType={sortType}
          onSelect={handleOrderBySelect}
          onModify={resetReviews}
          onDelete={resetReviews}
        />
        <VisibleComponent
          shows={accumulativeItems.length > 0}
          TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
        />
      </ProductReviewFormProvider>
    </div>
  );
};

export default Review;

import { useEffect, useState } from 'react';

import {
  useProfileProductReviewActionContext,
  useProfileProductReviewStateContext,
  Button,
  ThumbList,
  VisibleComponent,
  InfiniteScrollLoader,
  useInfiniteScroll,
  useProductReviewStateContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal/FullModal';
import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import ProductThumbItem from '../../../components/ProductThumbItem/ProductThumbItem';
import ReviewForm from '../../../components/ReviewForm';
import TotalCount from '../TotalCount';

const DEFAULT_REVIEW_FORM_STATE = {
  productNo: 0,
  productName: '',
  productImageUrl: '',
  optionNo: 0,
  orderOptionNo: 0,
  optionDisplayLabel: '',
  optionStatusType: null,
};

const ReviewedProductTotalCount = () => {
  const {
    reviewableProduct: { totalCount },
  } = useProfileProductReviewStateContext();

  return <TotalCount title="작성 가능 후기" count={totalCount} />;
};

const EmptyReviewableProduct = () => (
  <div className="empty-list">
    <p>작성가능 후기가 없습니다.</p>
  </div>
);

const ReviewableProductList = () => {
  const {
    reviewableProduct: { totalCount },
  } = useProfileProductReviewStateContext();

  const { reviewConfig } = useProductReviewStateContext();
  const { fetchProfileReviewableProducts } = useProfileProductReviewActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const [reviewDetail, setReviewDetail] = useState({ ...DEFAULT_REVIEW_FORM_STATE });

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (param) => {
      const { data } = await fetchProfileReviewableProducts(param);

      return data.items;
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  const resetReviewableProductListState = () => {
    setReviewDetail({ ...DEFAULT_REVIEW_FORM_STATE });

    setIsRegistrationModalOpen(false);
  };

  const handleReviewFormWriteButtonClick = (reviewDetail) => {
    setReviewDetail(reviewDetail);

    setIsRegistrationModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await fetchInitialItems();

      resetReviewableProductListState();
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    reviewConfig?.expandedReviewConfig && fetchInitialItems();
  }, [reviewConfig?.expandedReviewConfig?.allReviewCntPerPage]);

  return (
    <div className="profile-list">
      <ReviewedProductTotalCount />

      <VisibleComponent
        shows={totalCount > 0}
        TruthyComponent={
          <>
            <ThumbList>
              {accumulativeItems.map(
                ({
                  productNo,
                  optionNo,
                  optionName,
                  optionValue,
                  brandName,
                  productName,
                  price,
                  imageUrl,
                  orderOptionNo,
                  usesOption,
                  orderStatusType,
                }) => {
                  const optionDisplayLabel = usesOption ? `${optionName}: ${optionValue}` : '';

                  return (
                    <div key={orderOptionNo} className="profile-product-review__list-item">
                      <ProductThumbItem
                        productNo={productNo}
                        productName={productName}
                        optionNo={optionNo}
                        brandName={brandName}
                        buyAmt={price.buyAmt}
                        imageUrl={imageUrl}
                        OptionComponent={() => <p className="product-thumb-item__option">{optionDisplayLabel}</p>}
                        optionDisplayLabel={optionDisplayLabel}
                      />
                      <Button
                        className="profile-product-review__register-button"
                        label="후기 작성하기"
                        onClick={() => {
                          handleReviewFormWriteButtonClick({
                            productNo,
                            productName,
                            productImageUrl: imageUrl,
                            optionNo,
                            orderOptionNo,
                            optionDisplayLabel: `${optionName}: ${optionValue}`,
                            orderStatusType,
                          });
                        }}
                      />
                    </div>
                  );
                }
              )}
            </ThumbList>
            <ListSkeleton className="profile-product-review__list" isLoading={isLoading} />
          </>
        }
        FalsyComponent={
          isLoading ? (
            <ListSkeleton className="profile-product-review__list" isLoading={isLoading} />
          ) : (
            <EmptyReviewableProduct />
          )
        }
      />

      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
      />
      <VisibleComponent
        shows={isRegistrationModalOpen && reviewDetail.productNo > 0}
        TruthyComponent={
          <FullModal title={'상품후기'}>
            <ReviewForm
              {...reviewDetail}
              isRegisterMode={true}
              onSubmit={handleSubmit}
              onCancel={() => setIsRegistrationModalOpen(false)}
            />
          </FullModal>
        }
      />
    </div>
  );
};

export default ReviewableProductList;

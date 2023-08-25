import { useEffect, useState } from 'react';

import {
  useProductInquiryFormActionContext,
  useProductInquiryStateContext,
  VisibleComponent,
  useModalActionContext,
  useProfileLikeStateContext,
  useProfileLikeActionContext,
  useInfiniteScroll,
  Button,
  ThumbList,
  InfiniteScrollLoader,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import ProductInquiryForm from '../../../components/ProductInquiryForm/ProductInquiryForm';
import ProductThumbItem from '../../../components/ProductThumbItem';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../../constants/common';

const DEFAULT_PRODUCT_INFORMATION = {
  productName: '',
  imageUrls: [''],
};

const EmptyList = () => (
  <div className="empty-list">
    <p>좋아요 내역이 없습니다.</p>
  </div>
);

const LikeList = () => {
  const { inquiryConfig } = useProductInquiryStateContext();

  const { openAlert } = useModalActionContext();
  const { postProductInquiryBy } = useProductInquiryFormActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const { profileLikeProduct } = useProfileLikeStateContext();
  const { fetchProfileLikeProduct, postProfileLikeByProductNos } = useProfileLikeActionContext();

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [productInformation, setProductInformation] = useState({
    ...DEFAULT_PRODUCT_INFORMATION,
  });

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      const { data } = await fetchProfileLikeProduct(requestOption);

      return data.items;
    },
    requestOption: {
      pageNumber: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      hasTotalCount: true,
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount: profileLikeProduct?.totalCount,
    });
  };

  // 상품문의
  const handleInquiryButtonClick = (productInformation) => {
    setProductInformation(productInformation);
    setIsRegistrationModalOpen(true);
  };

  const handleProductInquiryFormSubmit = async (productInquiryForm) => {
    try {
      await postProductInquiryBy({
        productNo: productInformation.productNo,
        ...productInquiryForm,
      });

      openAlert({
        message: '상품문의가 등록됐습니다.',
        onClose: () => {
          setProductInformation({
            ...DEFAULT_PRODUCT_INFORMATION,
          });
          setIsRegistrationModalOpen(false);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  // 삭제
  const handleDeleteButtonClick = async (productInformation) => {
    try {
      await postProfileLikeByProductNos({
        productNos: [productInformation.productNo],
      });

      await fetchInitialItems();
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    fetchInitialItems();
  }, []);

  return (
    <>
      <VisibleComponent
        shows={!(profileLikeProduct?.totalCount > 0)}
        TruthyComponent={isLoading ? <ListSkeleton isLoading={isLoading} /> : <EmptyList />}
        FalsyComponent={
          <>
            <div className="profile-like__list">
              {accumulativeItems.map((item, index) => (
                <ThumbList key={`${item.productNo}_${index}`} className="profile-like__list-item">
                  <ProductThumbItem
                    productNo={item.productNo}
                    productName={item.productName}
                    optionNo={item.optionNo}
                    brandName={item.brandName}
                    imageUrl={item.imageUrls.at(0)}
                    AmountComponent={() => {
                      const discountAmount = item.immediateDiscountAmt + item.additionDiscountAmt;
                      const originalPrice = discountAmount > 0 ? item.salePrice : 0;
                      const salePrice = item.salePrice - discountAmount;

                      return (
                        <ul className="profile-like__amount-list">
                          <li className="profile-like__amount-item">
                            <span>{convertToKoreanCurrency(salePrice)} 원</span>
                            {
                              <VisibleComponent
                                shows={discountAmount > 0}
                                TruthyComponent={
                                  <del className="profile-like__original-price">
                                    {convertToKoreanCurrency(originalPrice)} 원
                                  </del>
                                }
                              />
                            }
                          </li>
                        </ul>
                      );
                    }}
                  />
                  <div className="profile-like__buttons">
                    <Button
                      className="profile-like__inquiry-button"
                      label="상품문의"
                      onClick={() => handleInquiryButtonClick(item)}
                    />
                    <Button
                      className="profile-like__delete-button"
                      label="삭제"
                      onClick={() => handleDeleteButtonClick(item)}
                    />
                  </div>
                </ThumbList>
              ))}
            </div>
            <VisibleComponent
              shows={accumulativeItems.length > 0}
              TruthyComponent={
                <InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />
              }
            />
            <ListSkeleton isLoading={isLoading} />
          </>
        }
      />

      <VisibleComponent
        shows={isRegistrationModalOpen}
        TruthyComponent={
          <FullModal title={inquiryConfig.name}>
            <ProductInquiryForm
              productName={productInformation?.productName}
              productImageUrl={productInformation?.imageUrls[0]}
              ButtonGroup={(props) => (
                <>
                  <Button
                    className="review-form__submit-btn review-form__btn"
                    theme="dark"
                    label="취소"
                    onClick={() => setIsRegistrationModalOpen(false)}
                  />
                  <Button
                    className="review-form__submit-btn review-form__btn"
                    theme="caution"
                    label="등록"
                    onClick={() => handleProductInquiryFormSubmit(props)}
                  />
                </>
              )}
            />
          </FullModal>
        }
      />
    </>
  );
};

export default LikeList;

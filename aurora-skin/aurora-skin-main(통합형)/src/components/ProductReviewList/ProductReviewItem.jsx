import { memo, useMemo, useState } from 'react';

import { number, string, arrayOf, func, bool } from 'prop-types';

import {
  Button,
  IconBtn,
  RatingStar,
  VisibleComponent,
  useModalActionContext,
  useProductReviewFormActionContext,
  useProductReviewStateContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import { RATING_STAR } from '../../constants/rate';
// import { useErrorBoundaryActionContext } from '../ErrorBoundary';
import FullModal from '../FullModal/FullModal';
import ReviewForm from '../ReviewForm';
import Sanitized from '../Sanitized';

const ProductReviewItem = memo(
  ({
    productName,
    productNo,
    showsProductName = false,
    brandName = '',
    price,
    mainImageUrl,
    reviewNo,
    memberId,
    updatedDate,
    content,
    images,
    rate,
    optionDisplayLabel = '',
    isMine = false,
    onModify,
    onDelete,
  }) => {
    const { reviewConfig } = useProductReviewStateContext();
    const { deleteReviewBy } = useProductReviewFormActionContext();
    const { openConfirm } = useModalActionContext();
    // const { catchError } = useErrorBoundaryActionContext();

    const [isOpen, setIsOpen] = useState(false);
    const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);

    const imageCount = useMemo(() => images.length, [images]);

    const displayImages = useMemo(() => (isOpen ? images : [images.at(0)]), [images, isOpen]) ?? [];

    const handleEditBtnClick = () => {
      setIsModificationModalOpen(true);
    };

    const handleDeleteBtnClick = async () => {
      await openConfirm({
        message: (
          <>
            삭제 시 복구가 불가능합니다. <br />
            정말 삭제하시겠습니까?
          </>
        ),
        onConfirm: async () => {
          await deleteReviewBy({
            productNo,
            reviewNo,
          });
          await onDelete();
        },
        confirmLabel: '삭제',
      });
    };

    const handleFormModify = async () => {
      await onModify();

      setIsModificationModalOpen(false);
    };

    return (
      <>
        <li className={`product-review-item ${isOpen ? 'is-open' : ''}`}>
          <div className={`product-review-item__top`}>
            <div className={`product-review-item__rating`}>
              <RatingStar score={rate} isSmall={true} limit={RATING_STAR.LIMIT_SCORE} />
              <strong className={`${`product-review-item__score`}`}>{rate}</strong>
            </div>
            <span className={`product-review-item__date`}>{updatedDate}</span>
          </div>
          <div className={`product-review-item__content`}>
            <VisibleComponent
              shows={imageCount > 0}
              TruthyComponent={
                <div className={`product-review-item__image`}>
                  <ul>
                    {displayImages.map((image, index) => (
                      <li key={`${index}_product-review-item-image`}>
                        <img src={image} alt="상품 후기 이미지" />
                      </li>
                    ))}
                  </ul>
                  <span className={`product-review-item__image-count`}>{imageCount}</span>
                </div>
              }
            />
            <div className={`product-review-item__bottom`}>
              <div className={`product-review-item__order-info`}>
                <VisibleComponent
                  shows={showsProductName}
                  TruthyComponent={<p className="product-review-item__product-name">{productName}</p>}
                />
                <p className={`product-review-item__member-id`}>{memberId}</p>
                <p className="product-review-item__brand-name">{brandName}</p>
                <p className={`product-review-item__option-value`}>{optionDisplayLabel}</p>
                {price >= 0 && <p className="product-review-item__price">{convertToKoreanCurrency(price)}원</p>}
              </div>
              <div className={`product-review-item__text`}>
                <div className="product-review-item__text-detail">
                  <Sanitized html={content.replaceAll('\n', '<br />')} />
                </div>
                <IconBtn
                  className="arrow"
                  iconType="angle-down"
                  onClick={() => setIsOpen((prev) => !prev)}
                  size="sm"
                  hiddenLabel={true}
                  label={isOpen ? '리뷰 가리기' : '리뷰 보기'}
                />
              </div>
              <VisibleComponent
                shows={isMine}
                TruthyComponent={
                  <div className={`product-review-item__btns`}>
                    <Button label="수정" onClick={handleEditBtnClick} />
                    <Button label="삭제" onClick={handleDeleteBtnClick} />
                  </div>
                }
              />
            </div>
          </div>
        </li>
        <VisibleComponent
          shows={isModificationModalOpen}
          TruthyComponent={
            <FullModal title={reviewConfig.name} onClose={() => setIsModificationModalOpen(false)}>
              <ReviewForm
                isRegisterMode={false}
                reviewNo={reviewNo}
                productName={productName}
                productImageUrl={mainImageUrl}
                optionDisplayLabel={optionDisplayLabel}
                content={content}
                reviewImages={images.map((image) => ({
                  originName: image,
                  imageUrl: image,
                }))}
                rate={rate}
                onCancel={() => {
                  setIsModificationModalOpen(false);
                }}
                onModify={() => {
                  handleFormModify();
                }}
              />
            </FullModal>
          }
        />
      </>
    );
  }
);
ProductReviewItem.displayName = 'ProductReviewItem';
ProductReviewItem.propTypes = {
  productNo: number.isRequired,
  reviewNo: number.isRequired,
  memberId: string,
  onModify: func.isRequired,
  onDelete: func.isRequired,
  content: string.isRequired,
  images: arrayOf(string).isRequired,
  rate: number.isRequired,
  mainImageUrl: string,
  productName: string,
  brandName: string,
  price: number,
  optionDisplayLabel: string,
  updatedDate: string,
  isMine: bool,
  showsProductName: bool,
};
export default ProductReviewItem;

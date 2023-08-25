import { useCallback, useState, useMemo } from 'react';

import { string, number, arrayOf, shape, bool, oneOf, func } from 'prop-types';

import {
  Button,
  RatingStar,
  useModalActionContext,
  useProductReviewFormActionContext,
  useProductReviewStateContext,
} from '@shopby/react-components';
import { calculateRatingScoreByCurrentWidth } from '@shopby/shared';

import { RATING_STAR } from '../../constants/rate';
import BoardNoticeList from '../BoardNoticeList/BoardNoticeList';
import BoardProductItem from '../BoardProductItem';
import ReviewAccumulation from '../ReviewAccumulation';

import ReviewImage from './ReviewImage';
import ReviewTextArea from './ReviewTextArea';

const getAccumulationRewardNoticeTextByPhotoReviewConstraints = (reviewConfig, reviewDetail) => {
  const usePhotoAccumulation = reviewConfig.reviewAccumulationInfo.photoReviewsLength > 0;

  if (!usePhotoAccumulation || !reviewDetail.urls.length) {
    if (reviewConfig.reviewAccumulationInfo.reviewsLength > reviewDetail.content.length) {
      return reviewConfig.expandedReviewConfig.accumulationRewardNoticeText;
    }

    return '';
  }

  if (reviewConfig.reviewAccumulationInfo.photoReviewsLength > reviewDetail.content.length) {
    return reviewConfig.expandedReviewConfig.accumulationRewardNoticeText;
  }

  return '';
};

const getAccumulationRewardNoticeText = (reviewConfig, reviewDetail) => {
  if (!reviewConfig?.expandedReviewConfig?.accumulationRewardNoticeText) return '';

  if (!reviewConfig?.reviewAccumulationInfo) return '';

  if (reviewConfig.reviewAccumulationInfo.useYn === 'N') return '';

  return getAccumulationRewardNoticeTextByPhotoReviewConstraints(reviewConfig, reviewDetail);
};

const ReviewForm = ({
  isRegisterMode = true,
  reviewNo,
  productNo,
  orderOptionNo,
  optionNo,
  productName,
  productImageUrl,
  reviewImages = [],
  rate = RATING_STAR.LIMIT_SCORE,
  content = '',
  optionDisplayLabel,
  optionName = '',
  optionValue = '',
  orderProductOptionNo,
  options,
  onSelect,
  orderStatusType,
  onSubmit,
  onModify,
  onCancel,
}) => {
  const [reviewContent, setReviewContent] = useState(content);
  const [score, setScore] = useState(rate);
  const [images, setImages] = useState(reviewImages);

  const { reviewConfig } = useProductReviewStateContext();

  const { openAlert, openConfirm } = useModalActionContext();
  const { postReviewBy, putReviewBy } = useProductReviewFormActionContext();

  const optionLabel = optionDisplayLabel ?? (optionName && optionValue) ? `${optionName}: ${optionValue}` : '';

  const reviewRewardNoticeTexts = useMemo(() => {
    if (reviewConfig.expandedReviewConfig?.reviewRewardNoticeText) {
      return [reviewConfig.expandedReviewConfig.reviewRewardNoticeText];
    }

    return [];
  }, [reviewConfig.expandedReviewConfig?.reviewRewardNoticeText]);

  const handleRatingStarClick = useCallback(({ currentTarget, nativeEvent }) => {
    const _score = calculateRatingScoreByCurrentWidth({
      offsetX: nativeEvent.offsetX,
      width: currentTarget.offsetWidth,
    });

    setScore(_score);
  }, []);

  const handleReviewContentChange = (content) => {
    setReviewContent(content);
  };

  const handleReviewImageChange = (images) => {
    setImages(images);
  };

  const saveReview = async ({ content, urls, rate }) => {
    const request = {
      content,
      urls,
      rate,
      productNo,
      optionNo,
      orderOptionNo,
    };

    await postReviewBy(request);

    await openAlert({
      message: '상품후기가 등록되었습니다.',
      onClose: async () => {
        await onSubmit?.();
      },
    });
  };

  const modifyReview = async (reviewDetail) => {
    await putReviewBy({
      reviewNo,
      ...reviewDetail,
    });

    openAlert({
      message: '상품후기가 수정되었습니다.',
      onClose: async () => {
        await onModify?.();
      },
    });
  };

  const checkConditionsForAccumulation = (reviewDetail) => {
    const text = getAccumulationRewardNoticeText(reviewConfig, reviewDetail);
    const upsertFn = isRegisterMode ? saveReview : modifyReview;

    if (text) {
      openConfirm({
        message: text,
        onConfirm: () => {
          upsertFn(reviewDetail);
        },
      });
    } else {
      upsertFn(reviewDetail);
    }
  };

  const handleSubmit = () => {
    if (!reviewContent) {
      openAlert({
        message: '상품후기 내용을 입력해주세요.',
      });

      return;
    }

    const reviewDetail = {
      content: reviewContent,
      urls: images.map(({ imageUrl }) => imageUrl),
      rate: score,
    };

    if (!isRegisterMode || orderStatusType === 'BUY_CONFIRM') {
      checkConditionsForAccumulation(reviewDetail);

      return;
    }

    openConfirm({
      message: '후기 작성과 함께 구매확정 처리하시겠습니까?',
      onConfirm: () => {
        checkConditionsForAccumulation(reviewDetail);
      },
    });
  };

  return (
    <div className="board-form review-form">
      <BoardProductItem
        productName={productName}
        optionDisplayLabel={optionLabel}
        productImageUrl={productImageUrl}
        optionNo={orderProductOptionNo}
        options={options}
        onSelect={onSelect}
      />

      <div className="l-panel review-form__content">
        <div className="review-form__evaluation">
          <h3 className="review-form__title">상품은 마음에 드셨나요?</h3>
          <RatingStar onClick={handleRatingStarClick} score={score} limit={RATING_STAR.LIMIT_SCORE} />
        </div>
        <ReviewTextArea content={reviewContent} onChange={handleReviewContentChange} />
        <ReviewImage images={images} onChange={handleReviewImageChange} />

        <div className="board-form__button-group">
          <Button
            className="board-form__cancel-btn board-form__btn"
            theme="dark"
            label="취소"
            onClick={() => onCancel?.()}
          />
          <Button
            className="board-form__modify-btn board-form__btn"
            theme="caution"
            label={isRegisterMode ? '등록' : '수정'}
            onClick={handleSubmit}
          />
        </div>
        <ReviewAccumulation className="review-form__accumulation" />
      </div>
      <BoardNoticeList texts={reviewRewardNoticeTexts} />
    </div>
  );
};

export default ReviewForm;

ReviewForm.propTypes = {
  productName: string,
  productImageUrl: string,
  productNo: number,
  optionNo: number,
  orderOptionNo: number,
  reviewNo: number,
  isRegisterMode: bool,
  onSubmit: func,
  onModify: func,
  onCancel: func,
  optionName: string,
  optionValue: string,
  optionDisplayLabel: string,
  ButtonGroup: func,
  reviewImages: arrayOf(
    shape({
      originName: string,
      imageUrl: string,
    })
  ),
  rate: number,
  content: string,
  orderStatusType: oneOf(['DELIVERY_ING', 'DELIVERY_DONE', 'BUY_CONFIRM']),
  options: arrayOf(
    shape({
      nonReviewableProduct: bool,
      mallOptionsNo: number,
      orderNo: number,
      orderStatus: oneOf([
        'DEPOSIT_WAIT',
        'PAY_DONE',
        'PRODUCT_PREPARE',
        'DELIVERY_PREPARE',
        'DELIVERY_ING',
        'DELIVERY_DONE',
        'BUY_CONFIRM',
        'CANCEL_DONE',
        'RETURN_DONE',
        'EXCHANGE_DONE',
        'PAY_WAIT',
        'PAY_CANCEL',
        'PAY_FAIL',
        'DELETE',
        'EXCHANGE_WAIT',
        'REFUND_DONE',
        'CANCEL_PROCESSING',
        'RETURN_PROCESSING',
        'EXCHANGE_WAITING',
        'EXCHANGE_PROCESSING',
      ]),
      orderProductOptionNo: number,
    })
  ),
  orderProductOptionNo: number,
  onSelect: func,
};

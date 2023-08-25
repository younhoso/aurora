import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  MakeOrderBtn,
  AddToCartBtn,
  LikeBtn,
  useModalActionContext,
  VisibleComponent,
  Button,
  useProductOptionStateContext,
  useProductDetailStateContext,
  IconBtn,
  useProductDetailActionContext,
  useAuthActionContext,
  IconSVG,
  useNaverPayActionContext,
  useProductOptionActionContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';

import OptionQuantity from './OptionQuantity';
import OptionSelector from './OptionSelector';

const UNPURCHASABLE_STATUS = ['READY', 'FINISHED', 'STOP', 'PROHIBITION'];

const Purchase = () => {
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const {
    productDetail: { isSoldOut, likeStatus, limitations },
    originProductDetail,
  } = useProductDetailStateContext();
  const { showNaverPayButton, prepareNaverPay, checkUsesNaverPayOrder } = useNaverPayActionContext();
  const { fetchOptionToMakeOrder } = useProductOptionActionContext();
  const { updateLikeStatus } = useProductDetailActionContext();
  const { openConfirm } = useModalActionContext();
  const { totalPrice } = useProductOptionStateContext();
  const { isSignedIn } = useAuthActionContext();
  const [visible, setVisible] = useState(false);
  const { catchError } = useErrorBoundaryActionContext();

  const unpurchasable = useMemo(
    () => UNPURCHASABLE_STATUS.includes(originProductDetail?.status.saleStatusType) || isSoldOut,
    [originProductDetail?.status]
  );

  const handleMakeOrderBtnClick = (data) => {
    if (isSignedIn()) {
      location.href = `/order/${data.orderSheetNo}`;

      return;
    }
    location.href = `/sign-in?orderSheetNo=${data.orderSheetNo}`;
  };

  const handleCartBtnClick = () => {
    openConfirm({
      message: '장바구니에 담았습니다.',
      confirmLabel: '장바구니 가기',
      onConfirm: () => {
        location.href = '/cart';
      },
      cancelLabel: '쇼핑계속하기',
    });
  };

  useEffect(() => {
    (async () => {
      const usesNaverPayOrder = await checkUsesNaverPayOrder();

      if (usesNaverPayOrder && limitations?.naverPayHandling) {
        showNaverPayButton({
          containerElementId: 'naver-pay',
          usesWishListButton: true,
          redirectUrlAfterBuying: `${location.origin}/orders/confirm`,
          redirectUrlAfterWishing: location.origin,
          onBeforeBuyButtonClick: async () => {
            const {
              data: { products },
            } = await fetchOptionToMakeOrder();

            const naverPayItems = products.map(({ orderCnt, channelType, optionInputs, optionNo, productNo }) => ({
              orderCnt,
              channelType,
              optionInputs,
              optionNo,
              productNo,
            }));

            prepareNaverPay({ items: naverPayItems });
          },
          onBeforeWishListButtonClick: () => {
            prepareNaverPay({ productNo });
          },
        });
      }
    })();
  }, [limitations?.naverPayHandling]);

  return (
    <div className="purchase product-detail">
      <VisibleComponent
        shows={!unpurchasable}
        TruthyComponent={
          <IconBtn
            className={`purchase__opener ${visible ? 'is-show' : ''}`}
            iconType="angle-down"
            label={`구매 하기 옵션 ${visible ? '닫기' : '열기'}`}
            onClick={() => setVisible((prevVisible) => !prevVisible)}
          />
        }
      />

      <VisibleComponent
        shows={unpurchasable}
        TruthyComponent={
          <Button
            className="purchase__buy-btn purchase__buy-btn--unpurchasable"
            disabled={isSoldOut}
            theme="dark"
            label="구매불가"
          />
        }
      />

      <VisibleComponent
        shows={!isSoldOut && !visible && !unpurchasable}
        TruthyComponent={
          <div className="purchase__button-wrap">
            <LikeBtn
              className="purchase__like-btn"
              productNo={productNo}
              isActive={likeStatus.isLiked}
              count={likeStatus.count}
              onClick={({ count, isActive }) =>
                updateLikeStatus({
                  count,
                  isLiked: isActive,
                })
              }
            >
              <IconSVG
                fill={likeStatus.isLiked ? 'var(--point-color)' : 'var(--default-color)'}
                strokeWidth={0}
                size={40}
                name="fill-heart"
              />
            </LikeBtn>
            <Button className="purchase__buy-btn" theme="caution" label="구매하기" onClick={() => setVisible(true)} />
          </div>
        }
      />

      <div className="purchase__option" hidden={!visible}>
        <OptionSelector />
        <div className="purchase__quantity-box">
          <OptionQuantity />
        </div>
        <p className="purchase__total">
          <span>총 상품 금액</span>
          <em>
            <span className="highlight bold">{convertToKoreanCurrency(totalPrice)}</span>원
          </em>
        </p>
        <div className="purchase__btns">
          <AddToCartBtn onClick={handleCartBtnClick} onError={(e) => catchError(e)} channelType={channelType} />
          <MakeOrderBtn onClick={handleMakeOrderBtnClick} onError={(e) => catchError(e)} channelType={channelType} />
        </div>
        <div id="naver-pay" className="purchase__naver-pay-btn" />
      </div>
    </div>
  );
};

export default Purchase;

Purchase.propTypes = {
  isSoldOut: bool,
};

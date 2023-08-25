import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { bool, number, object, string, oneOf, array } from 'prop-types';

import {
  IconSVG,
  ThumbItem,
  ThumbList,
  LikeBtn,
  OptionProvider,
  useOptionActionContext,
  useModalActionContext,
  CartProvider,
  ProductOptionProvider,
  useCartActionContext,
} from '@shopby/react-components';
import { calculateDiscountedPrice, THUMB_LIST_TYPE } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../ErrorBoundary';
import ProductThumbBadge from '../../ProductThumbBadge';
import ProductThumbInfo from '../../ProductThumbInfo';

const LikeAddCart = ({ productNo, productName, isSoldOut, liked }) => {
  const [searchParams] = useSearchParams();
  const { fetchProductOption } = useOptionActionContext();
  const { addCart } = useCartActionContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const handleCartBtnClick = async () => {
    try {
      const {
        data: { type, flatOptions },
      } = await fetchProductOption({ productNo });

      if (type !== 'DEFAULT') {
        openAlert({
          label: '확인',
          message: (
            <>
              이 상품은 옵션이 있는 상품입니다. <br /> 상품상세에서 옵션을 선택 후 <br /> 장바구니에 담아주세요
            </>
          ),
          onClose: () => navigate(`/product-detail?productNo=${productNo}`),
        });

        return;
      }

      await addCart([
        {
          orderCnt: 1,
          channelType: searchParams.get('channelType'),
          optionInputs: [],
          optionNo: flatOptions[0].optionNo,
          productNo,
        },
      ]);
      // TODO: ProductOption에서 전달하는 방법 확인 후 수정 하기
      openConfirm({
        message: '장바구니에 담았습니다.',
        onConfirm: () => navigate('/cart'),
        confirmLabel: '장바구니 가기',
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    setIsActive(liked);
  }, [liked]);

  return (
    <>
      <LikeBtn
        className="thumb-fab thumb-fab--like"
        productNo={Number(productNo)}
        isActive={isActive}
        onClick={(data) => {
          setIsActive(data.isActive);
        }}
      >
        <span className="a11y">
          {productName} {!isActive ? '좋아요' : '좋아요 취소하기'}
        </span>
        <IconSVG fill={isActive ? '#f92626' : '#fff'} strokeWidth={0} size={40} name="fill-heart" />
      </LikeBtn>

      <button
        type="button"
        disabled={isSoldOut}
        className="thumb-fab thumb-fab--cart sc-cart-button"
        onClick={handleCartBtnClick}
      >
        <span className="a11y">{productName} 장바구니 담기</span>
        <IconSVG size={40} name="shopping-bag" />
      </button>
    </>
  );
};

const ProductGrid = ({ className, style, displayType, products }) => (
  <ThumbList style={style} displayType={displayType} className={className}>
    {products.map(
      ({
        productNo,
        adult,
        listImageUrls,
        isSoldOut,
        saleStatusType,
        salePrice,
        promotionText,
        productName,
        immediateDiscountAmt,
        additionalDiscountAmt,
        frontDisplayYn,
        liked,
      }) =>
        frontDisplayYn && (
          <ThumbItem
            key={productNo}
            resize="220x220"
            className={className}
            href={`/product-detail?productNo=${productNo}`}
            src={listImageUrls[0]}
            adult={adult}
            alt={productName}
            HoverViewComponent={
              <ProductOptionProvider>
                <CartProvider>
                  <OptionProvider>
                    {displayType === THUMB_LIST_TYPE.CART && (
                      <LikeAddCart
                        productNo={Number(productNo)}
                        productName={productName}
                        isSoldOut={isSoldOut}
                        liked={liked}
                      />
                    )}
                  </OptionProvider>
                </CartProvider>
              </ProductOptionProvider>
            }
          >
            <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />
            {displayType === THUMB_LIST_TYPE.SIMPLE_IMAGE ? (
              <a href={`/product-detail?productNo=${productNo}`}>
                <ProductThumbInfo
                  promotionText={promotionText}
                  productName={productName}
                  salePrice={calculateDiscountedPrice({ salePrice, immediateDiscountAmt, additionalDiscountAmt })}
                />
              </a>
            ) : (
              <ProductThumbInfo
                promotionText={promotionText}
                productName={productName}
                salePrice={calculateDiscountedPrice({ salePrice, immediateDiscountAmt, additionalDiscountAmt })}
              />
            )}
          </ThumbItem>
        )
    )}
  </ThumbList>
);

export default ProductGrid;

ProductGrid.propTypes = {
  style: object,
  className: string,
  products: array,
  displayType: oneOf(['SWIPE', 'GALLERY', 'LIST', 'PRODUCT_MOVE', 'SIMPLE_IMAGE', 'CART']),
};

LikeAddCart.propTypes = {
  productNo: number,
  isSoldOut: bool,
  liked: bool,
  productName: string,
};

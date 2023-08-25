import { useMemo } from 'react';

import {
  Checkbox,
  ThumbList,
  QuantityChanger,
  useCartActionContext,
  useCartStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import OptionLabel from '../../components/OptionLabel';
import ProductThumbItem from '../../components/ProductThumbItem';

const DeliverySection = () => {
  const { openConfirm } = useModalActionContext();
  const { updateIsDeliveryGroupChecked, updateIsCartNoChecked, deleteCartNos, modifyCart } = useCartActionContext();
  const { cartDetail, checkingStatusPerDeliveryGroup, checkingStatusPerCartNo } = useCartStateContext();

  const handleDeliveryGroupCheckboxChange = ({ currentTarget: { checked: isChecked } }, deliveryGroupIdx) => {
    updateIsDeliveryGroupChecked({ deliveryGroupIdx, isChecked });
  };

  const handleCartNoCheckBoxChange = ({ currentTarget: { checked: isChecked } }, cartNo) => {
    updateIsCartNoChecked({ cartNo, isChecked });
  };

  const handleDeleteBtnClick = (cartNo) => {
    openConfirm({
      message: '해당 상품을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      onConfirm: () => {
        deleteCartNos([cartNo]);
      },
    });
  };

  const handleQuantityChange = ({ orderCnt, cartNo, optionInputs }) => {
    modifyCart([{ orderCnt, cartNo, optionInputs }]);
  };

  const itemsForRender = useMemo(
    () => [
      ...(cartDetail?.deliveryGroups ?? []),
      ...(cartDetail?.invalidProducts.length
        ? [
            {
              // 구매 제한 상품을 deliveryGroupIdx === -1 으로 취급하면 CartProvider와 연동이 가능해집니다.
              partnerName: '구매 제한 상품',
              orderProducts: cartDetail.invalidProducts,
              isInvalidProduct: true,
            },
          ]
        : []),
    ],
    [cartDetail]
  );

  if (!cartDetail) return <></>;
  if (!cartDetail.deliveryGroups.length && !cartDetail.invalidProducts.length) {
    return <p className="cart__empty">장바구니에 담긴 상품이 없습니다.</p>;
  }

  return (
    <>
      {itemsForRender.map(({ partnerName, orderProducts, isInvalidProduct }, deliveryGroupIdx) => (
        <section className="l-panel cart__delivery-section" key={deliveryGroupIdx}>
          <p className="cart__check-all-btn cart__check-all-btn--delivery-group">
            <Checkbox
              label={partnerName}
              isRounded={true}
              checked={checkingStatusPerDeliveryGroup[isInvalidProduct ? -1 : deliveryGroupIdx] ?? false}
              onChange={(e) => handleDeliveryGroupCheckboxChange(e, isInvalidProduct ? -1 : deliveryGroupIdx)}
              // 구매 제한 상품을 deliveryGroupIdx === -1 으로 취급하면 CartProvider와 연동이 가능해집니다.
            />
          </p>
          {orderProducts
            .flatMap(({ orderProductOptions, brandName, imageUrl, productName, optionUsed }) =>
              orderProductOptions.map((orderProductOption) => ({
                ...orderProductOption,
                brandName,
                imageUrl,
                productName,
                optionUsed,
              }))
            )
            .map(
              ({
                brandName,
                imageUrl,
                cartNo,
                orderCnt,
                productName,
                optionUsed,
                optionName,
                optionValue,
                price,
                optionInputs,
                stockCnt,
                productNo,
              }) => (
                <div className="cart__product" key={cartNo}>
                  <Checkbox
                    isRounded={true}
                    checked={checkingStatusPerCartNo[cartNo] ?? false}
                    onChange={(e) => handleCartNoCheckBoxChange(e, cartNo)}
                  />
                  <div className="cart__product-detail">
                    <ThumbList>
                      <ProductThumbItem
                        imageUrl={imageUrl}
                        brandName={brandName}
                        productName={productName}
                        productNo={productNo}
                        isRedirectingDisabled={isInvalidProduct}
                      />
                    </ThumbList>

                    <div className="cart__quantity-controller">
                      {optionUsed && (
                        <>
                          <div className="cart__product-option">
                            <OptionLabel
                              optionName={optionName}
                              optionValue={optionValue}
                              optionInputs={optionInputs}
                            />
                            <button className="cart__delete-btn" onClick={() => handleDeleteBtnClick(cartNo)}>
                              <span className="a11y">상품 삭제</span>
                            </button>
                          </div>
                        </>
                      )}

                      <p>
                        <QuantityChanger
                          initialValue={orderCnt}
                          onChange={(cnt) => handleQuantityChange({ orderCnt: cnt, cartNo, optionInputs })}
                          max={stockCnt}
                          min={1}
                          disabled={isInvalidProduct}
                        />

                        <span className="cart__product-price">
                          <span>
                            <span className="bold">
                              {isInvalidProduct ? '- ' : convertToKoreanCurrency(price.buyAmt)}
                            </span>
                            원
                          </span>
                          {!optionUsed && (
                            <button className="cart__delete-btn" onClick={() => handleDeleteBtnClick(cartNo)} />
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
        </section>
      ))}
    </>
  );
};

export default DeliverySection;

import { useState, useMemo } from 'react';

import { sumBy } from 'lodash-es';
import { number } from 'prop-types';

import { VisibleComponent, useProductDetailStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import TitleModal from '../../../components/TitleModal';

const DISCOUNT_LABEL_MAP = {
  additionDiscountAmt: '추가할인',
  immediateDiscountAmt: '즉시할인',
};

const DiscountPriceInformation = () => {
  const {
    originProductDetail: { price },
  } = useProductDetailStateContext();

  const discountPriceStatus = useMemo(
    () =>
      Object.entries(DISCOUNT_LABEL_MAP)
        .map(([key, label]) => ({
          key,
          label,
          discountAmt: price[key],
        }))
        .filter(({ discountAmt }) => discountAmt > 0),
    [price]
  );

  const totalDiscountPrice = useMemo(() => sumBy(discountPriceStatus, 'discountAmt'), [discountPriceStatus]);

  return (
    <div className="discount-price-information">
      <ul className="discount-price-information__detail">
        {discountPriceStatus.map(({ key, label, discountAmt }) => (
          <li key={key}>
            <p>{label}</p>
            <p>- {convertToKoreanCurrency(discountAmt)} 원</p>
          </li>
        ))}
      </ul>
      <div className="discount-price-information__total">
        <p>총 할인금액</p>
        <p>- {convertToKoreanCurrency(totalDiscountPrice)}원</p>
      </div>
      <ul className="discount-price-information__description">
        <li>※ 상품 옵션에 따라 할인혜택이 상이할 수 있습니다.</li>
        <li>※ 비회원 구매 시 할인적용이 불가능할 수 있습니다.</li>
      </ul>
    </div>
  );
};

DiscountPriceInformation.propTypes = {
  price: number,
};

const PriceInformation = ({ discountRate, discountedPrice, originalPrice }) => {
  const [visibleDiscountPriceModal, setVisibleDiscountPriceModal] = useState(false);

  return (
    <>
      <div className="product-summary__price-detail">
        <VisibleComponent
          shows={discountRate > 0}
          TruthyComponent={
            <p className="product-summary__off-percent">
              {discountRate}
              <span>%</span>
            </p>
          }
        />
        <div className="product-summary__discounted-price">
          <p className="product-summary__price">
            {convertToKoreanCurrency(discountedPrice)}
            <span>원</span>
          </p>
          <VisibleComponent
            shows={discountRate > 0}
            TruthyComponent={
              <del className="product-summary__original-price">
                {convertToKoreanCurrency(originalPrice)}
                <button className="help-btn" onClick={() => setVisibleDiscountPriceModal((prev) => !prev)}>
                  <span className="a11y">할인 내역 툴팁 보기</span>
                </button>
              </del>
            }
          />
        </div>
      </div>
      <VisibleComponent
        shows={visibleDiscountPriceModal}
        TruthyComponent={
          <TitleModal
            title="할인내역"
            classModifier="discount-price-information"
            onClose={() => setVisibleDiscountPriceModal(false)}
          >
            <DiscountPriceInformation />
          </TitleModal>
        }
      />
    </>
  );
};
PriceInformation.propTypes = {
  discountRate: number,
  discountedPrice: number,
  originalPrice: number,
};
export default PriceInformation;

import { useCallback, useMemo, useState } from 'react';

import { debounce } from 'lodash-es';
import { bool, string } from 'prop-types';

import {
  Coupon,
  useCouponByProductStateContext,
  useCouponByProductActionContext,
  VisibleComponent,
  Icon,
  useModalActionContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import { COUPON_DOWNLOAD_BUTTON_DEBOUNCE_TIME } from '../../constants/debounceTime';

const COUPON_TYPE_LABEL = {
  PRODUCT: '상품',
  CART: '주문',
  CART_DELIVERY: '장바구니 배송비',
};

// 쿠폰 할인 정보
const getDiscountInfo = (coupon) => {
  const limitSalePrice = coupon.useConstraint.minSalePrice;

  if (coupon.discountInfo.discountRate) {
    return {
      amount: coupon.discountInfo.discountRate,
      unit: '%',
      maxAmount: coupon.discountInfo.maxDiscountAmt,
      limitSalePrice,
    };
  }

  return {
    amount: convertToKoreanCurrency(coupon.discountInfo.discountAmt),
    unit: '원',
    maxAmount: 0,
    limitSalePrice,
  };
};

const IssuedCoupon = () => (
  <div className="coupon__issued">
    <Icon name="check-white" />
    <p>발급완료</p>
  </div>
);

const EmptyCoupons = () => (
  <div className="empty-list">
    <p>등록된 쿠폰이 없습니다.</p>
  </div>
);

const Coupons = ({ allIssued, channelType }) => {
  const { coupons } = useCouponByProductStateContext();
  const { downloadCouponByCouponNo, fetchIssuableCouponsByProductNo } = useCouponByProductActionContext();
  const { openAlert } = useModalActionContext();

  const [shouldPreventDoubleDownload, setShouldPreventDoubleDownload] = useState(false);
  const [issuedCouponNos, setIssuedCouponNos] = useState([]);

  if (!coupons.length) return <EmptyCoupons />;

  const downloadableCoupons = useMemo(() => coupons.filter(({ downloadable }) => downloadable), [coupons]);

  const fetchCoupons = () => {
    setShouldPreventDoubleDownload(false);

    fetchIssuableCouponsByProductNo({
      includesCartCoupon: true,
      channelType,
    });
  };

  const handleDownloadCoupon = debounce(
    useCallback(({ couponNo }) => {
      (async () => {
        if (shouldPreventDoubleDownload) return;

        setShouldPreventDoubleDownload(true);

        try {
          await downloadCouponByCouponNo({
            couponNo,
            channelType,
          });

          setIssuedCouponNos((prev) => [...prev, couponNo]);

          fetchCoupons();
        } catch (e) {
          const message = e?.error?.serverError?.message;

          if (message) {
            await openAlert({
              message,
            });
          }

          fetchCoupons();
        }
      })();
    }, []),
    COUPON_DOWNLOAD_BUTTON_DEBOUNCE_TIME
  );

  return (
    <ul className="coupons">
      {downloadableCoupons.map((coupon) => {
        const { amount, unit, maxAmount, limitSalePrice } = getDiscountInfo(coupon);
        const hasBeenIssued = allIssued ? allIssued : issuedCouponNos.includes(coupon.couponNo);
        const modifier = hasBeenIssued ? 'issued' : '';

        const couponTypeLabel = COUPON_TYPE_LABEL[coupon.couponType];

        return (
          <li className={`coupon__wrap${modifier ? ` coupon__wrap--${modifier}` : ''}`} key={coupon.couponNo}>
            <Coupon
              couponName={coupon.couponName}
              DiscountComponent={
                <p className="coupon__discount-information">
                  <span className="coupon__discount-amount">
                    {amount} {unit}
                  </span>
                  <span className="coupon__discount-label">{couponTypeLabel} 할인</span>
                </p>
              }
              disabled={!coupon.downloadable || shouldPreventDoubleDownload}
              onDownloadCoupon={() => !shouldPreventDoubleDownload && handleDownloadCoupon(coupon)}
            >
              <VisibleComponent shows={!!modifier} TruthyComponent={<IssuedCoupon />} />
              <VisibleComponent
                shows={maxAmount > 0}
                TruthyComponent={<p>최대 {convertToKoreanCurrency(maxAmount)} 원 할인</p>}
              />
              <VisibleComponent
                shows={limitSalePrice > 0}
                TruthyComponent={<p>{convertToKoreanCurrency(limitSalePrice)} 원 이상 구매 시 사용가능</p>}
              />
            </Coupon>
          </li>
        );
      })}
    </ul>
  );
};

export default Coupons;

Coupons.propTypes = {
  allIssued: bool,
  channelType: string,
};

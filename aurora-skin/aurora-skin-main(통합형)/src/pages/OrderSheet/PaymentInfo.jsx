import { useMemo } from 'react';

import { useOrderSheetStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import PriceTag from '../../components/PriceTag';

const PaymentInfo = () => {
  const {
    orderSheet,
    paymentInfo: {
      paymentAmt,
      totalStandardAmt,
      productCouponAmt,
      cartCouponAmt,
      deliveryAmt,
      usedAccumulationAmt,
      remoteDeliveryAmt,
      totalAdditionalDiscountAmt,
      totalImmediateDiscountAmt,
    },
  } = useOrderSheetStateContext();
  const totalDiscountAmt = productCouponAmt + cartCouponAmt + totalAdditionalDiscountAmt + totalImmediateDiscountAmt;
  const totalDeliveryAmt = deliveryAmt + remoteDeliveryAmt;

  const finalAmount = useMemo(
    () => ({
      name: '최종 결제금액',
      amountLabel: convertToKoreanCurrency(paymentAmt),
    }),
    [paymentAmt]
  );

  const details = useMemo(
    () => [
      {
        name: '상품금액 합계',
        amountLabel: convertToKoreanCurrency(totalStandardAmt),
      },
      {
        name: '할인금액 합계',
        amountLabel: `- ${convertToKoreanCurrency(totalDiscountAmt)}`,
      },
      {
        name: '적립금 사용 금액 합계',
        amountLabel: `- ${convertToKoreanCurrency(usedAccumulationAmt)}`,
      },
      {
        name: '배송비 합계',
        amountLabel: `+ ${convertToKoreanCurrency(totalDeliveryAmt)}`,
      },
    ],
    [totalDiscountAmt, totalDiscountAmt, usedAccumulationAmt, deliveryAmt, remoteDeliveryAmt]
  );

  const numberOfCOD = useMemo(
    () =>
      orderSheet?.deliveryGroups.reduce(
        (acc, { deliveryPayType }) => (deliveryPayType === 'PAY_ON_DELIVERY' ? acc + 1 : acc),
        0
      ) ?? 0,
    [orderSheet]
  );

  return (
    <section className="l-panel order-sheet__payment-info">
      <PriceTag finalAmount={finalAmount} details={details} isUpsideDown={true}>
        {numberOfCOD !== 0 && (
          <dl className="order-sheet__number-of-COD">
            <dt>- 착불 배송</dt>
            <dd>{numberOfCOD} 건</dd>
          </dl>
        )}
      </PriceTag>
    </section>
  );
};

export default PaymentInfo;

import { useCartStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import PriceTag from '../../components/PriceTag';

const CartPriceTag = () => {
  const { paymentInfo } = useCartStateContext();

  const paymentDetails = [
    {
      name: '상품금액 합계',
      amountLabel: convertToKoreanCurrency(paymentInfo.standardAmt),
    },
    {
      name: '할인금액 합계',
      amountLabel: `- ${convertToKoreanCurrency(paymentInfo.discountAmt)}`,
    },
    {
      name: '배송비 합계',
      amountLabel: `+ ${convertToKoreanCurrency(paymentInfo.totalPrePaidDeliveryAmt)}`,
    },
  ];

  return (
    <>
      <PriceTag
        finalAmount={{
          name: '총 결제금액',
          amountLabel: convertToKoreanCurrency(paymentInfo.totalAmt),
        }}
        details={paymentDetails}
      >
        <span className="cart__mileage">
          예상적립&nbsp;<em>{convertToKoreanCurrency(paymentInfo.accumulationAmtWhenBuyConfirm)}</em>&nbsp;M
        </span>
      </PriceTag>
    </>
  );
};

export default CartPriceTag;

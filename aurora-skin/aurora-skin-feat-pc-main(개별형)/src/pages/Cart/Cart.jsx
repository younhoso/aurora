import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import {
  Button,
  CartProvider,
  NaverPayProvider,
  OrderSheetProvider,
  useCartActionContext,
  useCartStateContext,
  useMallStateContext,
  useNaverPayActionContext,
  useOrderSheetActionContext,
  usePageScriptsActionContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import CartPriceTag from './CartPriceTag';
import CartTopSelectManager from './CartTopSelectManager';
import DeliverySection from './DeliverySection';
import FixedOrderBtn from './FixedOrderBtn';

const CartContent = () => {
  const { fetchCartDetail } = useCartActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { checkedProducts, checkedCartNos, cartDetail } = useCartStateContext();
  const { showNaverPayButton, prepareNaverPay, checkUsesNaverPayOrder } = useNaverPayActionContext();
  const { makeOrderSheet } = useOrderSheetActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '장바구니',
  });

  useEffect(() => {
    fetchCartDetail();
  }, []);

  useEffect(() => {
    if (cartDetail) {
      applyPageScripts('CART', { cart: cartDetail });
    }
  }, [cartDetail]);

  const handleOrderBtnClick = async () => {
    try {
      const { data } = await makeOrderSheet({
        cartNos: checkedCartNos,
        products: checkedProducts,
      });
      location.href = `/order/${data.orderSheetNo}`;
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    (async () => {
      const usesNaverPayOrder = await checkUsesNaverPayOrder();
      if (usesNaverPayOrder) {
        showNaverPayButton({
          containerElementId: 'naver-pay',
          isCartPage: true,
          redirectUrlAfterBuying: '/order/confirm',
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!checkedProducts) return;

    const items = checkedProducts.map(({ productNo, optionNo, orderCnt, optionInputs, channelType }) => ({
      productNo,
      optionNo,
      orderCnt,
      optionInputs,
      channelType: channelType ?? '',
    }));

    prepareNaverPay({ items });
  }, [checkedProducts]);

  return (
    <div className="cart">
      <CartTopSelectManager />
      <DeliverySection />
      <section className="l-panel cart__payment-info">
        <CartPriceTag />
        <Button className="cart__order-btn" label="주문하기" onClick={handleOrderBtnClick} />
        <div className="cart__naver-pay-btn" id="naver-pay" />
      </section>
      <FixedOrderBtn onOrderBtnClick={handleOrderBtnClick} />
    </div>
  );
};

const Cart = () => {
  const { clientId, mallProfile } = useMallStateContext();
  const { cartConfig } = useMallStateContext();

  return (
    <OrderSheetProvider>
      <NaverPayProvider clientId={clientId} mallProfile={mallProfile} platform={isMobile ? 'MOBILE_WEB' : 'PC'}>
        <CartProvider
          dividesInvalidProducts={true}
          guestCartOption={{
            storagePeriodByDays: cartConfig?.storagePeriod,
            storageMaxQuantity: cartConfig?.storageMaxQuantity,
          }}
        >
          <CartContent />
        </CartProvider>
      </NaverPayProvider>
    </OrderSheetProvider>
  );
};

export default Cart;

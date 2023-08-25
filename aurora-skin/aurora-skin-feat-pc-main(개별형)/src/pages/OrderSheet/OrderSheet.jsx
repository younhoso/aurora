import { createRef, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import {
  Button,
  MyShippingAddressProvider,
  OrderSheetProvider,
  useAuthStateContext,
  useMyShippingAddressActionContext,
  useMyShippingAddressStateContext,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  DEFAULT_ORDER_SHEET_PROVIDER_STATE,
  usePageScriptsActionContext,
  useMallStateContext,
} from '@shopby/react-components';
import { isSignedIn, parsePhoneNumber } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { convertBooleanToYorN } from '../../utils';

import OrdererInfoForm from './OrdererInfoForm';
import OrderProductTable from './OrderProductTable';
import PaymentInfo from './PaymentInfo';
import PayMethodSelector from './PayMethodSelector';
import PromotionController from './PromotionController';
import ShippingAddressInfoForm from './ShippingAddressInfoForm';
import TermsChecker from './TermsChecker';
import useValidateFormMaker from './useValidateFormMaker';

const CUSTOM_ORDER_SHEET_TERMS = [
  {
    label: '구매하실 상품의 결제 정보를 확인하였으며, 구매 진행에 동의합니다.',
    termsType: '구매하실 상품의 결제 정보를 확인하였으며, 구매 진행에 동의합니다.', // 확장성 고려
    isRequired: true,
  },
];

const OrderSheetContent = () => {
  const orderSheetRef = {
    ordererInfoFormRef: {
      ordererNameInputRef: createRef(),
      emailInputRef: createRef(),
      phoneNumberInputRef: createRef(),
      passwordInputRef: createRef(),
      passwordForConfirmationInputRef: createRef(),
    },
    shippingAddressInfoFormRef: {
      receiverNameInputRef: createRef(),
      addressFormRef: createRef(),
      mobilePhoneNumberInputRef: createRef(),
      addressDetailInputRef: createRef(),
    },
    depositBankFormRef: {
      bankAccountSelectRef: createRef(),
      remitterNameInputRef: createRef(),
    },
  };
  const { orderSheetNo } = useParams();
  const { t } = useTranslation('title');
  const { profile } = useAuthStateContext();
  const { order, fetchOrderSheet, updateOrdererInfo, updateShippingAddressInfo, resetShippingAddressInfo } =
    useOrderSheetActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const {
    ordererInfo,
    shippingAddressInfo,
    termsStatus,
    orderSheet,
    needsDepositBankForm,
    bankAccountToDeposit,
    remitterName,
  } = useOrderSheetStateContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { fetchMyShippingAddress } = useMyShippingAddressActionContext();
  const { defaultAddress } = useMyShippingAddressStateContext();
  const { validateForm } = useValidateFormMaker(orderSheetRef);

  const hasDeliverableProduct = useMemo(
    () =>
      orderSheet?.deliveryGroups
        ?.map(({ orderProducts }) => orderProducts.some(({ deliverable }) => deliverable))
        .some((deliverable) => deliverable),
    [orderSheet]
  );

  useLayoutChanger({ hasBackBtnOnHeader: true, title: t('orderSheet') });

  useEffect(() => {
    fetchOrderSheet({ orderSheetNo, includesMemberAddress: false });
    if (isSignedIn()) {
      fetchMyShippingAddress();
    }
  }, []);

  useEffect(() => {
    if (!orderSheet) return;

    applyPageScripts('ORDER', { orderSheet });
  }, [orderSheet]);

  useEffect(() => {
    if (!defaultAddress || shippingAddressInfo.zipCode) return;

    resetShippingAddressInfo();
    updateShippingAddressInfo({
      addressNo: defaultAddress.addressNo,
      addressName: defaultAddress.addressName,
      receiverName: defaultAddress.receiverName,
      roadAddress: defaultAddress.receiverAddress,
      mobilePhoneNumber: parsePhoneNumber(defaultAddress.receiverContact1),
      addressDetail: defaultAddress.receiverDetailAddress,
      zipCode: defaultAddress.receiverZipCd,
      countryCd: defaultAddress.countryCd,
    });

    if (defaultAddress.receiverContact2) {
      updateShippingAddressInfo({
        phoneNumber: parsePhoneNumber(defaultAddress.receiverContact2),
      });
    }
  }, [defaultAddress]);

  useEffect(() => {
    if (!profile) return;

    const { memberName, email, mobileNo } = profile;
    const [emailId = '', emailDomain = ''] = email?.split('@') ?? [];

    updateOrdererInfo({
      ordererName: memberName,
      emailId,
      emailDomain,
      phoneNumber: mobileNo
        ? parsePhoneNumber(mobileNo, { isWithDash: false })
        : DEFAULT_ORDER_SHEET_PROVIDER_STATE.ordererInfo.phoneNumber,
    });
  }, [profile]);

  const handleOrderBtnClick = () => {
    const isValid = validateForm({
      ordererInfo,
      shippingAddressInfo,
      needsShippingAddressInfo: hasDeliverableProduct,
      termsStatus,
      needsDepositBankForm,
      bankAccountToDeposit,
      remitterName,
    });
    if (!isValid) return;

    try {
      order({
        platform: isMobile ? 'MOBILE_WEB' : 'PC',
        confirmUrl: `${location.origin}/order/confirm?deliverable=${convertBooleanToYorN(hasDeliverableProduct)}`,
      });
    } catch (e) {
      catchError(e);
    }
  };

  return (
    <div className="order-sheet">
      <OrdererInfoForm refs={orderSheetRef.ordererInfoFormRef} />
      {hasDeliverableProduct && <ShippingAddressInfoForm refs={orderSheetRef.shippingAddressInfoFormRef} />}
      <OrderProductTable />
      <PromotionController />
      <PaymentInfo />
      <PayMethodSelector refs={orderSheetRef.depositBankFormRef} />
      <TermsChecker />
      <Button className="order-sheet__pay-btn" label={'결제 하기'} onClick={handleOrderBtnClick} />
    </div>
  );
};

const OrderSheet = () => {
  const { clientId, mallProfile } = useMallStateContext();

  return (
    <OrderSheetProvider
      clientId={clientId}
      mallProfile={mallProfile}
      customTerms={CUSTOM_ORDER_SHEET_TERMS}
      termTypesToExclude={'ORDER_INFO_AGREE'}
    >
      <MyShippingAddressProvider>
        <OrderSheetContent />
      </MyShippingAddressProvider>
    </OrderSheetProvider>
  );
};

export default OrderSheet;

OrderSheet.propTypes = {};

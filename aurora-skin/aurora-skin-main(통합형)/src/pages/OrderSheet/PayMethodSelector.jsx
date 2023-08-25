import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { isEqual } from 'lodash-es';
import { object, shape } from 'prop-types';

import {
  PayMethodBtn,
  SelectBox,
  TextField,
  MyPay,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  useModalActionContext,
  MyPayMethodBtn,
} from '@shopby/react-components';
import { sortWithPriority } from '@shopby/shared';
import { PG_TYPES_MAP } from '@shopby/shared/constants';
import { PAY_TYPE_MAP } from '@shopby/shared/types';

const HIDDEN_PAY_TYPE = [
  'NAVER_PAY', // 네이버페이 주문형
];
const HIDDEN_PG_TYPE = ['MY_PAY'];
const PAY_TYPES_WITH_PRIORITY = [
  'PAYCO',
  'NAVER_EASY_PAY',
  'KAKAO_PAY',
  'TOSS_PAY',
  'CREDIT_CARD',
  'REALTIME_ACCOUNT_TRANSFER',
  'VIRTUAL_ACCOUNT',
  'MOBILE',
  'ESCROW_REALTIME_ACCOUNT_TRANSFER',
  'ESCROW_VIRTUAL_ACCOUNT',
  'ACCOUNT',
];

const PayMethodSelector = ({ refs }) => {
  const {
    orderSheet,
    selectedPayMethod,
    availablePayMethods,
    bankAccountToDeposit,
    remitterName,
    needsDepositBankForm,
    hasMyPayPayment,
    myPayInfo: selectedMyPayInfo,
  } = useOrderSheetStateContext();
  const {
    updateSelectedPayMethod,
    updateBankAccountToDeposit,
    updateRemitterName,
    resetBankAccountToDeposit,
    selectMyPayPayment,
  } = useOrderSheetActionContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { t } = useTranslation(['order']);

  const mallAccountOptionMap = useMemo(
    () =>
      orderSheet?.tradeBankAccountInfos.reduce((acc, accountInfo) => {
        acc[`${accountInfo.bankName} ${accountInfo.bankAccount}`] = accountInfo;

        return acc;
      }, {}) ?? {},
    [orderSheet]
  );

  const mallAccountSelectBoxOptions = useMemo(
    () =>
      Object.keys(mallAccountOptionMap).map((mallAccountOption) => ({
        label: mallAccountOption,
        value: mallAccountOption,
      })),
    [mallAccountOptionMap]
  );

  const selectedMallAccountSelectBoxValue = useMemo(() => {
    const { bankAccount, bankCode, bankName } = bankAccountToDeposit;
    if (!bankAccount || !bankCode) {
      return '';
    }

    return `${bankName} ${bankAccount}`;
  }, [bankAccountToDeposit]);

  const payMethodsToBeExposed = sortWithPriority(availablePayMethods, PAY_TYPES_WITH_PRIORITY, 'payType').filter(
    ({ payType, pgType }) => !HIDDEN_PAY_TYPE.includes(payType) && !HIDDEN_PG_TYPE.includes(pgType)
  );

  const handlePayMethodBtnClick = (payMethod) => {
    resetBankAccountToDeposit();
    updateRemitterName('');
    updateSelectedPayMethod(payMethod);
  };

  const handleRemitterNameChange = ({ currentTarget: { value } }) => {
    updateRemitterName(value);
  };

  const handleMallAccountSelect = ({ currentTarget: { value } }) => {
    updateBankAccountToDeposit(mallAccountOptionMap[value]);
  };

  const handleClickWithdrawFromMyPayService = (deleteService) => {
    openConfirm({
      message: t('withdrawFromMyPayService'),
      confirmLabel: t('withdrawLabel'),
      onConfirm: () => {
        deleteService();
      },
    });
  };

  const handleClickDeleteMyPayPaymentMethod = (deletePayment) => {
    openConfirm({
      message: t('deleteMyPayPaymentMethod'),
      confirmLabel: t('deleteLabel'),
      onConfirm: () => {
        deletePayment();
      },
    });
  };
  const handleAlertSuccessDeleteMyPayPayment = () => {
    openAlert({
      message: t('alertSuccessDeleteMyPayPaymentMethod'),
    });
  };
  const handleAlertRegisterDuplicationMainPayment = () => {
    openAlert({
      message: t('alertRegisterDuplicationMainPayment'),
    });
  };

  const handleClickMyPayPayment = ({ payToken, payMethod, bankCardCode, selectQuota }) => {
    selectMyPayPayment({ payToken, payMethod, bankCardCode, selectQuota });
  };

  return (
    <section className="l-panel order-sheet__pay-method">
      <p className="order-sheet__pay-method-title">결제수단 선택</p>

      <div className="order-sheet__pay-method-btns">
        {hasMyPayPayment && (
          <MyPayMethodBtn
            myPayInfo={orderSheet?.myPayInfo}
            isChecked={selectedPayMethod.pgType === PG_TYPES_MAP.MY_PAY}
            onClick={() => handlePayMethodBtnClick({ pgType: PG_TYPES_MAP.MY_PAY })}
          />
        )}
        {payMethodsToBeExposed.map((payMethod) => (
          <PayMethodBtn
            key={JSON.stringify(payMethod)}
            payType={payMethod.payType}
            label={PAY_TYPE_MAP[payMethod.payType]}
            isChecked={isEqual(payMethod, selectedPayMethod)}
            onClick={() => handlePayMethodBtnClick(payMethod)}
          />
        ))}
      </div>
      {selectedPayMethod?.pgType === PG_TYPES_MAP.MY_PAY && (
        <MyPay
          myPayInfo={orderSheet?.myPayInfo}
          selectedMyPayInfo={selectedMyPayInfo}
          onClickWithdrawFromMyPayService={handleClickWithdrawFromMyPayService}
          onClickDeletePaymentMethod={handleClickDeleteMyPayPaymentMethod}
          onClickMyPayPayment={handleClickMyPayPayment}
          onAlertRegisterDuplicationMainPayment={handleAlertRegisterDuplicationMainPayment}
          onAlertSuccessDeleteMyPayPayment={handleAlertSuccessDeleteMyPayPayment}
        />
      )}
      {needsDepositBankForm && (
        <div className="order-sheet__account-input-wrap">
          <div className="order-sheet__item">
            <label className="order-sheet__item-subject">입금자명</label>
            <TextField
              ref={refs.remitterNameInputRef}
              value={remitterName}
              valid="NO_SPECIAL"
              onChange={handleRemitterNameChange}
              placeholder="입금하시는 분의 성함을 입력해주세요."
              maxLength={10}
            />
          </div>
          <div className="order-sheet__item">
            <label className="order-sheet__item-subject">계좌번호</label>
            <SelectBox
              ref={refs.bankAccountSelectRef}
              value={selectedMallAccountSelectBoxValue}
              onSelect={handleMallAccountSelect}
              options={mallAccountSelectBoxOptions}
              hasEmptyOption={true}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default PayMethodSelector;

PayMethodSelector.propTypes = {
  refs: shape({
    bankAccountSelectRef: object,
    remitterNameInputRef: object,
  }),
};

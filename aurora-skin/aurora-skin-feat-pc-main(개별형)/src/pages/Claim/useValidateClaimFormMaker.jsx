import { cloneDeep, merge } from 'lodash-es';

import { useClaimStateContext, useModalActionContext } from '@shopby/react-components';
import { POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS, POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS } from '@shopby/shared';

const DEFAULT_OPTION = {
  activeStatus: {
    claimCount: true,
    claimReason: true,
    claimReasonDetail: true,
    accountForRefund: true,
    receiverName: true,
    address: true, // true 일 경우 우편번호 및 주소값 함께 검사
    mobilePhoneNumber: true,
    phoneNumber: true,
  },
  refs: {
    claimReasonSelectRef: null,
    claimReasonDetailTextareaRef: null,
    bankSelectRef: null,
    bankAccountInputRef: null,
    bankDepositorNameInputRef: null,
    receiverNameInputRef: null,
    searchZipCodeBtnRef: null,
    mobilePhoneNumberInputRef: null, // PhoneNumberInput 컴포넌트가 사용하는 ref를 넣어야합니다.
    phoneNumberInputRef: null, // PhoneNumberInput 컴포넌트가 사용하는 ref를 넣어야합니다.
  },
};

/**
 * 클레임 페이지 폼 입력값에 대한 유효성 검사 함수를 만듭니다.
 * 인자에 activeStatus를 넘길 때, 유효성 검사를 진행하지 않을 항목을 false로 넘겨주세요.
 * 기본값은 true 입니다.
 *
 * @param {{
 *    claimCount: boolean,
 *    claimReason: boolean,
 *    claimReasonDetail: boolean,
 *    receiverName: boolean,
 *    address: boolean,
 *    mobilePhoneNumber: boolean,
 *    phoneNumber: boolean,
 *    accountForRefund: boolean,
 *  }} activeStatus
 * @param {{
 *    claimReasonSelectRef: ?object ,
 *    claimReasonDetailTextareaRef: ?object,
 *    receiverNameInputRef: ?object,
 *    searchZipCodeBtnRef: ?object,
 *    mobilePhoneNumberInputRef: ?object,
 *    phoneNumberInputRef: ?object,
 * }}
 * @returns
 */
const useValidateClaimFormMaker = (option = DEFAULT_OPTION) => {
  const {
    activeStatus,
    refs: {
      claimReasonSelectRef,
      claimReasonDetailTextareaRef,
      receiverNameInputRef,
      searchZipCodeBtnRef,
      mobilePhoneNumberInputRef, // PhoneNumberInput 컴포넌트가 사용하는 ref를 넣어야합니다.
      phoneNumberInputRef, // PhoneNumberInput 컴포넌트가 사용하는 ref를 넣어야합니다.
      bankSelectRef,
      bankAccountInputRef,
      bankDepositorNameInputRef,
    },
  } = merge(cloneDeep(DEFAULT_OPTION), option);
  const { openAlert } = useModalActionContext();
  const {
    checkedOptionAmount,
    claimReason,
    claimReasonDetail,
    returnAddress: { receiverName, receiverZipCd, receiverAddress, receiverContact1, receiverContact2 },
    accountForRefund: { bank, bankAccount, bankDepositorName },
  } = useClaimStateContext();

  const validation = {
    isZeroClaimCount: () => {
      if (checkedOptionAmount > 0) return false;

      openAlert({
        message: '신청할 상품을 선택해주세요.',
      });

      return true;
    },
    isClaimReasonNotSelected: () => {
      if (claimReason) return false;

      openAlert({
        message: '신청 사유를 선택해주세요.',
        onClose: () => {
          console.log(claimReasonSelectRef);
          claimReasonSelectRef?.current?.focus();
        },
      });

      return true;
    },
    isClaimReasonDetailEmpty: () => {
      if (claimReasonDetail) return false;

      openAlert({
        message: '상세 사유를 입력해주세요.',
        onClose: () => {
          claimReasonDetailTextareaRef?.current?.focus();
        },
      });

      return true;
    },
    isReceiverNameEmpty: () => {
      if (receiverName) return false;

      openAlert({
        message: '반품자명을 입력해주세요.',
        onClose: () => {
          receiverNameInputRef?.current?.focus();
        },
      });

      return true;
    },
    isReceiverZipCdEmpty: () => {
      if (receiverZipCd) return false;

      openAlert({
        message: '우편번호를 입력해주세요.',
        onClose: () => {
          searchZipCodeBtnRef?.current?.focus();
        },
      });

      return true;
    },
    isReceiverAddressEmpty: () => {
      if (receiverAddress) return false;

      openAlert({
        message: '주소를 입력해주세요.',
        onClose: () => {
          searchZipCodeBtnRef?.current?.focus();
        },
      });

      return true;
    },
    isMobilePhoneCarrierNumberEmpty: () => {
      if (receiverContact1.carrierNumber) return false;

      openAlert({
        message: '올바른 휴대폰 번호를 입력해주세요.',
        onClose: () => {
          mobilePhoneNumberInputRef?.current?.focusCarrierNumber();
        },
      });

      return true;
    },
    isMobilePhoneFirstSerialInvalid: () => {
      if (POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS.includes(receiverContact1.firstSerial.length)) return false;

      openAlert({
        message: '올바른 휴대폰 번호를 입력해주세요.',
        onClose: () => {
          mobilePhoneNumberInputRef?.current?.focusFirstSerial();
        },
      });

      return true;
    },
    isMobilePhoneSecondSerialInvalid: () => {
      if (POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS.includes(receiverContact1.secondSerial.length)) return false;

      openAlert({
        message: '올바른 휴대폰 번호를 입력해주세요.',
        onClose: () => {
          mobilePhoneNumberInputRef?.current?.focusSecondSerial();
        },
      });

      return true;
    },
    isPhoneCarrierNumberEmpty: () => {
      if (receiverContact2.carrierNumber) return false;

      openAlert({
        message: '올바른 전화 번호를 입력해주세요.',
        onClose: () => {
          phoneNumberInputRef?.current?.focusCarrierNumber();
        },
      });

      return true;
    },
    isPhoneFirstSerialInvalid: () => {
      if (POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS.includes(receiverContact2.firstSerial.length)) return false;

      openAlert({
        message: '올바른 전화 번호를 입력해주세요.',
        onClose: () => {
          phoneNumberInputRef?.current?.focusFirstSerial();
        },
      });

      return true;
    },
    isPhoneSecondSerialInvalid: () => {
      if (POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS.includes(receiverContact2.secondSerial.length)) return false;

      openAlert({
        message: '올바른 전화 번호를 입력해주세요.',
        onClose: () => {
          phoneNumberInputRef?.current?.focusSecondSerial();
        },
      });

      return true;
    },
    isBankNotSelected: () => {
      if (bank) return false;

      openAlert({
        message: '은행사를 선택해주세요.',
        onClose: () => {
          bankSelectRef?.current?.focus();
        },
      });

      return true;
    },
    isBankAccountEmpty: () => {
      if (bankAccount) return false;
      openAlert({
        message: '계좌번호를 입력해주세요.',
        onClose: () => {
          bankAccountInputRef?.current?.focus();
        },
      });

      return true;
    },
    isBankDepositorNameEmpty: () => {
      if (bankDepositorName) return false;

      openAlert({
        message: '예금주를 입력해주세요.',
        onClose: () => {
          bankDepositorNameInputRef?.current?.focus();
        },
      });

      return true;
    },
  };

  const validationMap = {
    // 순서대로 유효성 검사가 진행됩니다.
    claimCount: [validation.isZeroClaimCount],
    claimReason: [validation.isClaimReasonNotSelected],
    claimReasonDetail: [validation.isClaimReasonDetailEmpty],
    accountForRefund: [
      validation.isBankNotSelected,
      validation.isBankAccountEmpty,
      validation.isBankDepositorNameEmpty,
    ],
    receiverName: [validation.isReceiverNameEmpty],
    address: [validation.isReceiverAddressEmpty],
    mobilePhoneNumber: [
      validation.isMobilePhoneCarrierNumberEmpty,
      validation.isMobilePhoneFirstSerialInvalid,
      validation.isMobilePhoneSecondSerialInvalid,
    ],
    phoneNumber: [
      validation.isPhoneCarrierNumberEmpty,
      validation.isPhoneFirstSerialInvalid,
      validation.isPhoneSecondSerialInvalid,
    ],
  };

  const validate = () =>
    Object.entries(validationMap).every(([validationTarget, validations]) => {
      if (!activeStatus[validationTarget]) return true;

      return validations.every((validation) => !validation());
    });

  return { validate };
};

export default useValidateClaimFormMaker;

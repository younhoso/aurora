import { useModalActionContext } from '@shopby/react-components';
import {
  checkPassword,
  POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS,
  POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS,
  REG_EX_FOR_CHECK_FORMAT,
} from '@shopby/shared';

const INVALID_PASSWORD_MESSAGE_MAP = {
  MUST_CONTAIN_THREE_TYPES_IN_LENGTH_LESS_THAN_10:
    '비밀번호는 영문, 숫자, 특수문자를 3종류 모두 조합하여 8~20자로 입력해주세요.',
  MUST_CONTAIN_TWO_TYPES_IN_LENGTH_MORE_THAN_10:
    '비밀번호는 영문, 숫자, 특수문자를 2종류 이상 조합하여 10~20자로 입력해주세요.',
  LENGTH_IS_INVALID: '비밀번호는 영문, 숫자, 특수문자를 3종류 모두 조합하여 8~20자로 입력해주세요.',
  INVALID_SPECIAL: '비밀번호 특수문자는 !@#$%^&*+=-_.()만 사용 가능합니다.',
};

const useValidateFormMaker = (ref) => {
  const { openAlert } = useModalActionContext();

  const {
    ordererInfoFormRef: {
      ordererNameInputRef,
      emailInputRef,
      phoneNumberInputRef,
      passwordInputRef,
      passwordForConfirmationInputRef,
    },
    shippingAddressInfoFormRef: {
      receiverNameInputRef,
      addressFormRef,
      mobilePhoneNumberInputRef: receiverMobilePhoneNumberInputRef,
    },
    depositBankFormRef: { bankAccountSelectRef, remitterNameInputRef },
  } = ref;

  const validateForm = ({
    ordererInfo: { ordererName, emailId, emailDomain, phoneNumber: ordererMobilePhoneNumber, guestInfo },
    shippingAddressInfo: {
      receiverName,
      zipCode,
      roadAddress,
      mobilePhoneNumber: receiverMobilePhoneNumber,
      addressDetail,
    },
    needsShippingAddressInfo,
    needsDepositBankForm,
    bankAccountToDeposit,
    remitterName,
    termsStatus,
  }) => {
    const ordererInfoValidation = {
      isOrdererNameEmpty: () => {
        if (ordererName) return false;

        openAlert({
          message: '주문자 명을 입력해주세요.',
          onClose: () => {
            ordererNameInputRef?.current?.focus();
          },
        });

        return true;
      },
      isEmailIdEmpty: () => {
        if (emailId) return false;

        openAlert({
          message: '이메일 아이디를 입력해주세요.',
          onClose: () => {
            emailInputRef?.current?.focusId();
          },
        });

        return true;
      },
      isEmailDomainEmpty: () => {
        if (emailDomain) return false;

        openAlert({
          message: '이메일 도메인을 입력해주세요.',
          onClose: () => {
            emailInputRef?.current?.focusDomain();
          },
        });

        return true;
      },
      isEmailInvalid: () => {
        const email = `${emailId}@${emailDomain}`;

        if (email.match(REG_EX_FOR_CHECK_FORMAT.EMAIL)) return false;

        openAlert({
          message: '올바른 형식의 이메일을 입력해주세요.',
          onClose: () => {
            emailInputRef?.current?.focusDomain();
          },
        });

        return true;
      },
      isPhoneCarrierNumberEmpty: () => {
        if (ordererMobilePhoneNumber.carrierNumber) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            phoneNumberInputRef?.current?.focusCarrierNumber();
          },
        });

        return true;
      },
      isPhoneNumberFirstSerialInvalid: () => {
        if (POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS.includes(ordererMobilePhoneNumber.firstSerial.length)) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            phoneNumberInputRef?.current?.focusFirstSerial();
          },
        });

        return true;
      },
      isPhoneNumberSecondSerialInvalid: () => {
        if (POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS.includes(ordererMobilePhoneNumber.secondSerial.length)) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            phoneNumberInputRef?.current?.focusSecondSerial();
          },
        });

        return true;
      },
      isPasswordEmpty: () => {
        if (!guestInfo || guestInfo.password) return false;

        openAlert({
          message: '구매 비밀번호를 입력해주세요.',
          onClose: () => {
            passwordInputRef?.current?.focus();
          },
        });

        return true;
      },
      isPasswordInvalid: () => {
        if (!guestInfo) return false;

        const { password } = guestInfo;
        const { isValid, message } = checkPassword(password);

        if (isValid) return false;

        openAlert({
          message: INVALID_PASSWORD_MESSAGE_MAP[message],
          onClose: () => {
            passwordInputRef?.current?.focus();
          },
        });

        return true;
      },
      isPasswordForConfirmationEmpty: () => {
        if (!guestInfo || guestInfo.passwordForConfirmation) return false;

        openAlert({
          message: '구매 비밀번호 확인을 입력해주세요.',
          onClose: () => {
            passwordForConfirmationInputRef?.current?.focus();
          },
        });

        return true;
      },
      isFailedToConfirmPassword: () => {
        if (!guestInfo || guestInfo.password === guestInfo.passwordForConfirmation) return false;

        openAlert({
          message: '구매 비밀번호 확인에 실패하였습니다. 비밀번호 확인 입력값을 확인해주세요.',
          onClose: () => {
            passwordForConfirmationInputRef?.current?.focus();
          },
        });

        return true;
      },
    };

    const shippingAddressInfoValidation = {
      isReceiverNameEmpty: () => {
        if (receiverName) return false;

        openAlert({
          message: '받는 사람을 입력해주세요.',
          onClose: () => {
            receiverNameInputRef?.current?.focus();
          },
        });

        return true;
      },
      isReceiverAddressEmpty: () => {
        if (zipCode && roadAddress) return false;

        openAlert({
          message: '배송지 주소를 입력해주세요.',
          onClose: () => {
            addressFormRef.current?.focusSearchButton();
          },
        });

        return true;
      },
      isAddressDetailEmpty: () => {
        if (addressDetail) return false;

        openAlert({
          message: '상세 주소를 입력해주세요.',
          onClose: () => {
            addressFormRef.current?.focusDetailAddressInput();
          },
        });

        return true;
      },
      isReceiverPhoneCarrierNumberEmpty: () => {
        if (receiverMobilePhoneNumber.carrierNumber) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            receiverMobilePhoneNumberInputRef?.current?.focusCarrierNumber();
          },
        });

        return true;
      },
      isReceiverMobilePhoneNumberFirstSerialInvalid: () => {
        if (POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS.includes(receiverMobilePhoneNumber.firstSerial.length)) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            receiverMobilePhoneNumberInputRef?.current?.focusFirstSerial();
          },
        });

        return true;
      },
      isReceiverMobilePhoneNumberSecondSerialInvalid: () => {
        if (POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS.includes(receiverMobilePhoneNumber.secondSerial.length)) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            receiverMobilePhoneNumberInputRef?.current?.focusSecondSerial();
          },
        });

        return true;
      },
    };

    const depositBankFormValidation = {
      isBankAccountToDepositNotSelected: () => {
        if (!needsDepositBankForm || (bankAccountToDeposit?.bankAccount && bankAccountToDeposit?.bankCode))
          return false;

        openAlert({
          message: '입금할 계좌를 선택해주세요.',
          onClose: () => {
            bankAccountSelectRef.current?.focus();
          },
        });

        return true;
      },
      isRemitterNameEmpty: () => {
        if (!needsDepositBankForm || remitterName) return false;

        openAlert({
          message: '입금자명을 입력해주세요.',
          onClose: () => {
            remitterNameInputRef.current?.focus();
          },
        });

        return true;
      },
    };

    const termsStatusValidation = {
      isSomeRequiredTermNotChecked: () => {
        const requiredTermsStatusValues = Object.values(termsStatus).filter(({ isRequired }) => isRequired);
        if (requiredTermsStatusValues.every(({ isChecked }) => isChecked)) return false;

        openAlert({
          message: '약관 동의 필수 항목에 체크하여야 결제를 진행할 수 있습니다.',
        });

        return true;
      },
    };

    const validations = [
      ...Object.values(ordererInfoValidation),
      needsShippingAddressInfo ? [...Object.values(shippingAddressInfoValidation)] : () => false,
      ...Object.values(depositBankFormValidation),
      ...Object.values(termsStatusValidation),
    ];

    return validations.flat().every((validation) => !validation());
  };

  return {
    validateForm,
  };
};

export default useValidateFormMaker;

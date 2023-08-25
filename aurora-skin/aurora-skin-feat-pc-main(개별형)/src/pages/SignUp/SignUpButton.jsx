import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSignUpActionContext, useSignUpStateContext, useModalActionContext } from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';

const SignUpButton = () => {
  const { postProfile } = useSignUpActionContext();
  const { openAlert } = useModalActionContext();
  const { isSignedUp } = useSignUpStateContext();

  const { verifyUserId, verifyUserPassword, confirmUserPassword, verifyUserName, validateMobile, validateEmail } =
    useSignUpActionContext();
  const { validationStatus, signUpMemberInfo } = useSignUpStateContext();
  const { catchError } = useErrorBoundaryActionContext();

  const navigate = useNavigate();

  const validate = () => {
    verifyUserId();
    verifyUserPassword();
    confirmUserPassword();
    validateMobile();
    verifyUserName();
    validateEmail();
  };

  // eslint-disable-next-line complexity
  const hasEmpty = () =>
    !signUpMemberInfo.emailId ||
    !signUpMemberInfo.emailDomain ||
    !signUpMemberInfo.firstSerial ||
    !signUpMemberInfo.memberId ||
    !signUpMemberInfo.memberName ||
    !signUpMemberInfo.password ||
    !signUpMemberInfo.passwordCheck ||
    !signUpMemberInfo.secondSerial;

  const handleSignUp = async () => {
    validate();

    const isInvalidMemberInfo = Object.values(validationStatus).some(({ result }) => !result);
    if (hasEmpty() || isInvalidMemberInfo) {
      openAlert({
        message: '필수 입력 사항을 확인 바랍니다.',
      });

      return;
    }

    try {
      await postProfile();
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    if (isSignedUp === true) {
      openAlert({
        message: '회원가입이 완료되었습니다.',
        onClose: () => {
          navigate('/', {
            replace: true,
          });
        },
      });
    }
  }, [isSignedUp]);

  return (
    <div className="sign-up-form__confirm">
      <button className="" onClick={handleSignUp}>
        회원가입
      </button>
    </div>
  );
};

export default SignUpButton;

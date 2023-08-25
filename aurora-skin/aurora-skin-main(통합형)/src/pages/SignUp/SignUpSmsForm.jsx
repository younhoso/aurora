import { useEffect } from 'react';

import {
  useMallStateContext,
  useSignUpActionContext,
  useSignUpStateContext,
  useIdentificationVerificationStateContext,
  TextField,
  Checkbox,
  Button,
  PhoneNumberInput,
  VisibleComponent,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import IdentificationVerificationBtn from '../../components/IdentificationVerificationBtn/IdentificationVerificationBtn';

import ValidationStatus from './ValidationStatus';

// eslint-disable-next-line complexity
const SignUpSmsForm = () => {
  const { mallJoinConfig } = useMallStateContext();
  const { isIdentificationVerificationReSend, isCiExist, ci } = useIdentificationVerificationStateContext();
  const {
    validateMobile,
    postAuthenticationsMobile,
    confirmAuthentication,
    setSignUpMemberInfo,
    setSmsReceiveInfo,
    setValidationStatus,
    setCi,
  } = useSignUpActionContext();

  const {
    signUpMemberInfo: { carrierNumber, firstSerial, secondSerial, certificatedNumber },
    timerTime,
    smsReceiveInfo,
    authenticationsRemainTimeBySeconds,
    authenticationReSend,
  } = useSignUpStateContext();

  const handleFormValueChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handlePhoneCarrierNumberSelect = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, carrierNumber: event.target.value }));
  };

  const handlePhoneFirstSerialNumberChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, firstSerial: event.target.value }));
  };

  const handlePhoneSecondSerialNumberChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, secondSerial: event.target.value }));
  };

  const handleSecondSerialBlur = () => {
    validateMobile();
  };

  const handleConfirmAuthentication = () => confirmAuthentication();
  const handleVerifyMobile = () => postAuthenticationsMobile();
  const handleSmsCheck = (event) => {
    event.target.checked
      ? setSmsReceiveInfo((prev) => ({ ...prev, checked: true }))
      : setSmsReceiveInfo((prev) => ({ ...prev, checked: false }));
  };

  useEffect(() => {
    if (isCiExist) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰번호가 이미 사용중입니다.' },
      }));
    } else {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: true, message: '' },
      }));
    }
  }, [isCiExist]);

  useEffect(() => {
    if (ci) setCi(ci);
  }, [ci]);

  return (
    <>
      <div className="sign-up-form__item">
        <label htmlFor="mobileNo" className="sign-up-form__tit">
          휴대폰 번호
        </label>
        <div className="sign-up-form__input-wrap">
          <PhoneNumberInput
            name="mobileNo"
            id="mobileNo"
            carrierNumber={carrierNumber}
            firstSerial={firstSerial}
            secondSerial={secondSerial}
            onCarrierNumberSelect={handlePhoneCarrierNumberSelect}
            onFirstSerialChange={handlePhoneFirstSerialNumberChange}
            onSecondSerialChange={handlePhoneSecondSerialNumberChange}
            onSecondSerialBlur={handleSecondSerialBlur}
          />
          <VisibleComponent
            shows={
              mallJoinConfig.authenticationTimeType === 'JOIN_TIME' &&
              mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.SMS_AUTHENTICATION
            }
            TruthyComponent={
              <Button label={authenticationReSend ? '재인증' : '인증번호 발송'} onClick={handleVerifyMobile} />
            }
          />

          {mallJoinConfig.authenticationTimeType === 'JOIN_TIME' &&
            mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE && (
              <IdentificationVerificationBtn
                label={isIdentificationVerificationReSend ? '재인증' : '휴대폰 본인인증'}
                type="signUp"
              />
            )}

          <ValidationStatus name="mobileNo" />
        </div>
      </div>
      <ul className="sign-up-form__agree-list">
        <li key={smsReceiveInfo.id}>
          <div className="sign-up-form__checkbox--partial">
            <Checkbox onChange={handleSmsCheck} checked={smsReceiveInfo.checked} label={smsReceiveInfo.title} />
          </div>
        </li>
      </ul>
      {mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.SMS_AUTHENTICATION &&
      authenticationsRemainTimeBySeconds ? (
        <div className="sign-up-form__item">
          <label htmlFor="certificatedNumber" className="sign-up-form__tit">
            인증번호
          </label>
          <div className="sign-up-form__input-wrap">
            <TextField
              name="certificatedNumber"
              id="certificatedNumber"
              value={certificatedNumber}
              placeholder="인증번호를 입력해주세요."
              onChange={handleFormValueChange}
              maxLength={6}
              valid="NO_SPACE"
            />
            <Button label={'확인'} onClick={handleConfirmAuthentication} />
          </div>
          {timerTime ? (
            <span className="timer">
              <span className="timer__text">유효시간</span>
              <span className="timer__number">{timerTime.minute}</span>
              <span className="timer__middle-sign">:</span>
              <span className="timer__number">{timerTime.second}</span>
            </span>
          ) : (
            ''
          )}
          <ValidationStatus name="certificatedNumber" />
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default SignUpSmsForm;

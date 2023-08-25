import { useRef } from 'react';

import {
  useMallStateContext,
  useSignUpActionContext,
  useSignUpStateContext,
  TextField,
  EmailInput,
  Checkbox,
  Button,
  SelectBox,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import { EMAIL_DOMAIN_OPTIONS } from '../../constants/form';

import ValidationStatus from './ValidationStatus';
// eslint-disable-next-line complexity
const SignUpEmailForm = () => {
  const { mallJoinConfig } = useMallStateContext();
  const {
    verifyUserEmail,
    validateEmail,
    postAuthenticationsEmail,
    getAuthenticationsEmail,
    setSignUpMemberInfo,
    setEmailReceiveInfo,
  } = useSignUpActionContext();

  const {
    signUpMemberInfo: { emailId, emailDomain, domainSelectorValue, certificatedNumber },
    timerTime,
    authenticationsRemainTimeBySeconds,
    authenticationReSend,
    emailReceiveInfo,
  } = useSignUpStateContext();

  const handleFormValueChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleEmailIdInputChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, emailId: event.target.value }));
  };

  const handleEmailDomainInputChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, emailDomain: event.target.value, domainSelectorValue: '직접 입력' }));
  };

  const handleEmailDomainSelect = ({ currentTarget }) => {
    setSignUpMemberInfo((prev) => ({
      ...prev,
      emailDomain: currentTarget.value,
      domainSelectorValue: currentTarget.value,
    }));

    if (!emailId && !validateEmail()) {
      return;
    }

    verifyUserEmail();
  };

  const emailRef = useRef(null);

  const handleDomainBlur = () => {
    if (!validateEmail()) {
      return;
    }
    verifyUserEmail();
  };
  const handleVerifyEmail = () => {
    postAuthenticationsEmail();
  };
  const handleConfirmEmailAuthentication = () => getAuthenticationsEmail();
  const handleEmailCheck = (event) => {
    event.target.checked
      ? setEmailReceiveInfo((prev) => ({ ...prev, checked: true }))
      : setEmailReceiveInfo((prev) => ({ ...prev, checked: false }));
  };

  return (
    <>
      <div className="sign-up-form__item">
        <label htmlFor="email" className="sign-up-form__tit">
          이메일 주소
        </label>
        <div className="sign-up-form__input-wrap">
          <EmailInput
            ref={emailRef}
            id={emailId}
            domain={emailDomain}
            onIdChange={handleEmailIdInputChange}
            onIdBlur={handleDomainBlur}
            onDomainChange={handleEmailDomainInputChange}
            onDomainBlur={handleDomainBlur}
          />
          <SelectBox
            hasEmptyOption={true}
            emptyOptionLabel={domainSelectorValue}
            onSelect={handleEmailDomainSelect}
            options={EMAIL_DOMAIN_OPTIONS}
          />
          <ValidationStatus name="email" />

          {mallJoinConfig.authenticationTimeType === 'JOIN_TIME' &&
          mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL ? (
            <Button
              className="authentication-btn"
              label={authenticationReSend ? `재인증` : `인증번호 발송`}
              onClick={() => {
                handleVerifyEmail();
              }}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <ul className="sign-up-form__agree-list">
        <li key={emailReceiveInfo.id}>
          <div className="sign-up-form__checkbox--partial">
            <Checkbox onChange={handleEmailCheck} checked={emailReceiveInfo.checked} label={emailReceiveInfo.title} />
          </div>
        </li>
      </ul>
      {mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL &&
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
            <Button label={'확인'} onClick={handleConfirmEmailAuthentication} />
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

export default SignUpEmailForm;

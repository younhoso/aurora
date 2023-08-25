/* eslint-disable complexity */
import { useMemo, useRef, useState } from 'react';

import {
  Button,
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  EmailInput,
  SelectBox,
  useMallStateContext,
  TextField,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import Timer from '../../components/Timer/Timer';
import { EMAIL_DOMAIN_OPTIONS } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationEmailForm = () => {
  const {
    updateNewEmail,
    updateCertificatedNumber,
    verifyExistEmail,
    confirmAuthenticationEmail,
    updateIsAuthenticationReSend,
    updateValidationStatus,
    validateEmail,
  } = useMemberModificationActionContext();
  const {
    newEmail,
    certificatedNumber,
    authenticationsRemainTimeBySeconds,
    isAuthenticationReSend,
    authenticateEmail,
  } = useMemberModificationStateContext();
  const { mallJoinConfig } = useMallStateContext();

  const emailSeparation = useMemo(() => newEmail.split('@'), [newEmail]);
  const emailId = [emailSeparation[0]];
  const emailDomain = [emailSeparation[1]];
  const emailRef = useRef(null);
  const [domainSelectorValue, setDomainSelectorValue] = useState('');

  const handleEmailIdInputChange = ({ currentTarget: { value } }) => {
    updateNewEmail(`${value}@${emailDomain}`);
  };
  const handleEmailDomainInputChange = ({ currentTarget: { value } }) => {
    updateNewEmail(`${emailId}@${value}`);
    setDomainSelectorValue('');
  };
  const handleEmailDomainSelect = ({ currentTarget: { value } }) => {
    updateNewEmail(`${emailId}@${value}`);
    setDomainSelectorValue(value);

    if (!validateEmail()) {
      return;
    }

    verifyExistEmail(newEmail);
  };

  const handleCertificatedNumber = ({ currentTarget: { value } }) => {
    updateCertificatedNumber(value);
  };

  const handleDomainBlur = () => {
    if (!validateEmail()) {
      return;
    }

    verifyExistEmail(newEmail);
  };

  const handleAuthenticateEmail = () => {
    if (!validateEmail()) {
      return;
    }
    if (!ValidationStatus.email.result) {
      return;
    }
    authenticateEmail(newEmail);
  };

  const isEmailAuthentication = useMemo(() => {
    if (
      mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL &&
      authenticationsRemainTimeBySeconds
    ) {
      return true;
    }

    return false;
  }, [mallJoinConfig, authenticationsRemainTimeBySeconds]);

  const isEmailType = useMemo(() => {
    if (mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL) {
      return true;
    }

    return false;
  }, [mallJoinConfig]);

  return (
    <>
      <div className="member-modification-form__item">
        <label htmlFor="emailId" className="member-modification-form__tit">
          이메일
        </label>
        <div className="member-modification-form__input-wrap">
          <EmailInput
            ref={emailRef}
            id={emailId}
            domain={emailDomain}
            onIdChange={handleEmailIdInputChange}
            onDomainChange={handleEmailDomainInputChange}
            onDomainBlur={handleDomainBlur}
            idDisabled={isEmailType && isAuthenticationReSend}
            domainDisabled={isEmailType && isAuthenticationReSend}
          />
          <SelectBox
            hasEmptyOption={true}
            emptyOptionLabel="직접 입력"
            value={domainSelectorValue}
            onSelect={handleEmailDomainSelect}
            options={EMAIL_DOMAIN_OPTIONS}
            disabled={isEmailType && isAuthenticationReSend}
          />
        </div>
        {mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_EMAIL && (
          <Button
            className="member-modification-form__btn--certificate"
            label={isAuthenticationReSend ? `재인증` : `인증번호 발송`}
            onClick={() => {
              isAuthenticationReSend ? updateIsAuthenticationReSend(false) : handleAuthenticateEmail();
            }}
          />
        )}
        <ValidationStatus name="email" />
      </div>
      {isEmailAuthentication && (
        <div className="member-modification-form__item">
          <label htmlFor="certificatedNumber" className="member-modification-form__tit">
            인증번호
          </label>
          <div className="member-modification-form__input-wrap">
            <TextField
              name="certificatedNumber"
              id="certificatedNumber"
              value={certificatedNumber}
              placeholder="인증번호를 입력해주세요."
              onChange={handleCertificatedNumber}
              maxLength={6}
              valid="NO_SPACE"
            />
          </div>
          <Button
            className="member-modification-form__btn--certificate"
            label={'확인'}
            onClick={() => {
              confirmAuthenticationEmail(certificatedNumber);
            }}
          />
          <Timer
            seconds={authenticationsRemainTimeBySeconds}
            onTimeOutAction={() => {
              updateValidationStatus((prev) => ({
                ...prev,
                certificatedNumber: {
                  result: false,
                  message: '유효시간이 초과되었습니다. 다시 [인증번호 발송] 클릭하여 발급된 인증번호를 입력해주세요.',
                },
              }));
            }}
          />
          <ValidationStatus name="certificatedNumber" />
        </div>
      )}
    </>
  );
};

export default MemberModificationEmailForm;

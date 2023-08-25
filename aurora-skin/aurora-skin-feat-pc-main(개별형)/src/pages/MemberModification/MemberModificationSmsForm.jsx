/* eslint-disable complexity */

import { useEffect, useMemo } from 'react';

import {
  TextField,
  Button,
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useIdentificationVerificationStateContext,
  PhoneNumberInput,
  useMallStateContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import IdentificationVerificationBtn from '../../components/IdentificationVerificationBtn/IdentificationVerificationBtn';
import Timer from '../../components/Timer';

import ValidationStatus from './ValidationStatus';

const MemberModificationSmsForm = () => {
  const {
    updateNewMobileNo,
    updateCertificatedNumber,
    authenticateMobile,
    confirmAuthenticationMobileNo,
    updateIsAuthenticationReSend,
    updateValidationStatus,
    updateCarrierNumber,
    updateFirstSerial,
    updateSecondSerial,
    validateMobile,
  } = useMemberModificationActionContext();

  const {
    newMobileNo,
    carrierNumber,
    firstSerial,
    secondSerial,
    certificatedNumber,
    authenticationsRemainTimeBySeconds,
    isAuthenticationReSend,
  } = useMemberModificationStateContext();
  const { isIdentificationVerificationReSend, isCiExist } = useIdentificationVerificationStateContext();
  const { mallJoinConfig } = useMallStateContext();

  const identificationBtnLabel = isIdentificationVerificationReSend ? '재인증' : '휴대폰 본인인증';
  const authenticationBtnLabel = isAuthenticationReSend ? `재인증` : `인증번호 발송`;

  const handlePhoneCarrierNumberSelect = ({ currentTarget: { value } }) => {
    updateCarrierNumber(value);
    updateNewMobileNo(`${value}${firstSerial}${secondSerial}`);
  };

  const handlePhoneFirstSerialNumberChange = ({ currentTarget: { value } }) => {
    updateFirstSerial(value);
    updateNewMobileNo(`${carrierNumber}${value}${secondSerial}`);
  };

  const handlePhoneSecondSerialNumberChange = ({ currentTarget: { value } }) => {
    updateSecondSerial(value);
    updateNewMobileNo(`${carrierNumber}${firstSerial}${value}`);
  };

  const handleCertificatedNumber = ({ currentTarget: { value } }) => {
    updateCertificatedNumber(value);
  };

  const handleOnSecondSerialBlur = () => {
    validateMobile();
  };

  const handleSetNewPhoneNumber = (newNumber) => {
    updateNewMobileNo(newNumber);
    updateCarrierNumber(newNumber.slice(0, 3));
    updateFirstSerial(newNumber.slice(3, 7));
    updateSecondSerial(newNumber.slice(7));
  };

  const handleAuthenticateMobile = (newMobileNo) => {
    // 회원 정보 수정에서 사용 안됨
    if (!validateMobile()) {
      return;
    }
    authenticateMobile(newMobileNo);
  };

  useEffect(() => {
    updateValidationStatus((prev) => ({
      ...prev,
      mobileNo: isCiExist
        ? { result: false, message: '휴대폰 번호가 이미 사용중입니다.' }
        : { result: true, message: '' },
    }));
  }, [isCiExist]);

  const isSmsAuthentication = useMemo(() => {
    if (
      mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.SMS_AUTHENTICATION &&
      authenticationsRemainTimeBySeconds
    ) {
      return true;
    }

    return false;
  }, [mallJoinConfig, authenticationsRemainTimeBySeconds]);

  const isMobileType = useMemo(() => {
    if (
      mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE ||
      mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.SMS_AUTHENTICATION
    ) {
      return true;
    }

    return false;
  }, [mallJoinConfig]);

  return (
    <>
      <div className="member-modification-form__item">
        <label htmlFor="mobileNo" className="member-modification-form__tit">
          휴대폰번호
        </label>
        <div className="member-modification-form__input-wrap">
          <PhoneNumberInput
            name="mobileNo"
            id="mobileNo"
            carrierNumber={carrierNumber}
            firstSerial={firstSerial}
            secondSerial={secondSerial}
            onCarrierNumberSelect={handlePhoneCarrierNumberSelect}
            onFirstSerialChange={handlePhoneFirstSerialNumberChange}
            onSecondSerialChange={handlePhoneSecondSerialNumberChange}
            onSecondSerialBlur={handleOnSecondSerialBlur}
            carrierNumberDisabled={isMobileType && isAuthenticationReSend}
            firstSerialDisabled={isMobileType && isAuthenticationReSend}
            secondSerialDisabled={isMobileType && isAuthenticationReSend}
          />
        </div>
        {mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.SMS_AUTHENTICATION && (
          <Button
            className="member-modification-form__btn--certificate"
            label={authenticationBtnLabel}
            onClick={() => {
              isAuthenticationReSend ? updateIsAuthenticationReSend(false) : handleAuthenticateMobile(newMobileNo);
            }}
          />
        )}
        {mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE && (
          <>
            <IdentificationVerificationBtn
              className="member-modification-form__btn--certificate"
              label={identificationBtnLabel}
              type="memberModify"
              onSetNewPhoneNumber={handleSetNewPhoneNumber}
            />
            <ValidationStatus name="certificatedNumber" />
          </>
        )}
        <ValidationStatus name="mobileNo" />
      </div>

      {isSmsAuthentication && (
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
              confirmAuthenticationMobileNo(certificatedNumber);
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

export default MemberModificationSmsForm;

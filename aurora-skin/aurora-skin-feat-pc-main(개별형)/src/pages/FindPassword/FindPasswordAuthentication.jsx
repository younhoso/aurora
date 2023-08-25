import { useEffect, useState } from 'react';

import { string } from 'prop-types';

import {
  useFindAccountStateContext,
  useAuthenticationStateContext,
  useAuthenticationActionContext,
  useModalActionContext,
  TextField,
  Button,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import Timer from '../../components/Timer/Timer';

export const FindPasswordAuthentication = ({ type: sendType }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    findAccountInfo: { memberId },
    memberNo,
  } = useFindAccountStateContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { openAlert } = useModalActionContext();

  const {
    authenticationInfo: { certificatedNumber },
    isAuthenticationReSend,
    authenticationsRemainTimeBySeconds,
  } = useAuthenticationStateContext();
  const {
    sendAuthentication,
    confirmAuthentication,
    updateAuthenticationInfo,
    updateIsAuthenticationReSend,
    updateAuthenticationsRemainTimeBySeconds,
  } = useAuthenticationActionContext();

  useEffect(() => {
    const initialSendAuthentication = async () => {
      try {
        await sendAuthentication({ memberNo, type: sendType, usage: 'FIND_PASSWORD' });
      } catch (e) {
        openAlert({
          message: '인증번호 발송에 실패하였습니다. 인증번호가 계속 오지 않을 경우, 고객센터로 문의해주세요.',
        });
        updateIsAuthenticationReSend(true);
      }
    };
    initialSendAuthentication();
  }, []);

  const handleCertificatedNumberChange = ({ currentTarget: { value } }) => {
    updateAuthenticationInfo({ certificatedNumber: value });
  };

  const handleConfirmAuthentication = async (certificatedNumber, sendType) => {
    try {
      await confirmAuthentication({ memberNo, certificatedNumber, type: sendType, usage: 'FIND_PASSWORD' });

      setErrorMessage('');
      location.href = `/change-password?memberId=${memberId}&certificationNumber=${certificatedNumber}&findMethod=${sendType}`;
    } catch (e) {
      catchError(e);
    }
  };

  return (
    <div className="find-password-authentication">
      <p className="find-password-authentication__tit">인증번호를 입력해주세요.</p>
      <div className="find-password-authentication__input-wrap">
        <TextField
          value={certificatedNumber}
          placeholder="인증번호"
          valid="NO_SPACE"
          maxLength={6}
          onChange={handleCertificatedNumberChange}
        />
      </div>
      {authenticationsRemainTimeBySeconds && (
        <Timer
          seconds={authenticationsRemainTimeBySeconds}
          onTimeOutAction={() => {
            setErrorMessage('유효시간이 만료되었습니다.');
            updateIsAuthenticationReSend(true);
          }}
        />
      )}

      {<p className="find-password-authentication__caution">{errorMessage}</p>}
      <div className="find-password-authentication__btn-wrap">
        {isAuthenticationReSend ? (
          <Button
            label={'재인증'}
            onClick={() => {
              setErrorMessage('');
              updateAuthenticationsRemainTimeBySeconds(null);
              sendAuthentication({ memberNo, type: sendType, usage: 'FIND_PASSWORD' });
            }}
          />
        ) : (
          <Button
            label={'확인'}
            onClick={() => {
              handleConfirmAuthentication(certificatedNumber, sendType);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FindPasswordAuthentication;

FindPasswordAuthentication.propTypes = {
  type: string,
};

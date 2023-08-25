import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { func } from 'prop-types';

import { useOpenIdSignInActionContext, useAuthStateContext, useModalActionContext } from '@shopby/react-components';

import OpenIdSignIn from '../../components/OpenIdSignIn';
const CheckOpenIdMember = ({ onAuthenticationBtnClick }) => {
  const location = useLocation();
  const { setOauthIdNoToLocalStorage, getOauthCompareResultToLocalStorage, removeOauthCompareResultToLocalStorage } =
    useOpenIdSignInActionContext();
  const { openAlert } = useModalActionContext();
  const { profile } = useAuthStateContext();

  const oauthCompareResult =
    getOauthCompareResultToLocalStorage() !== '' ? JSON.parse(getOauthCompareResultToLocalStorage()) : '';

  useEffect(() => {
    if (profile && !oauthCompareResult) {
      setOauthIdNoToLocalStorage(profile.oauthIdNo);
      location.state = {
        from: `${location.pathname}`,
        to: '/my-page',
      };
    }
  }, [profile]);

  useEffect(() => {
    if (oauthCompareResult !== '' && oauthCompareResult === false) {
      removeOauthCompareResultToLocalStorage();
      openAlert({
        message: `현재 로그인 한 간편로그인 계정과 다릅니다. 쇼핑몰 계정과 동일하게 로그인해주세요.`,
        onClose: () => {
          location.href = '/my-page';
        },
      });
    }
    if (oauthCompareResult === true) {
      removeOauthCompareResultToLocalStorage();
      onAuthenticationBtnClick();
    }
  }, [oauthCompareResult]);

  return (
    <div className="open-id-authentication">
      <p className="open-id-authentication__info-text">
        회원님의 정보를 안전하게 보호하기 위해 <br />
        계정을 재인증 해주세요.
      </p>
      <div className="open-id-authentication__link">
        <OpenIdSignIn label="로그인" providers={[profile?.providerType.toLowerCase().replace('_', '-')]} />
      </div>
    </div>
  );
};

export default CheckOpenIdMember;

CheckOpenIdMember.propTypes = {
  onAuthenticationBtnClick: func,
};

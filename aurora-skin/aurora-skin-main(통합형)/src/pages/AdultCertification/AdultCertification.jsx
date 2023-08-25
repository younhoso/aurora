import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { func } from 'prop-types';

import {
  useAuthActionContext,
  IdentificationVerificationProvider,
  SignInProvider,
  OpenIdSignInProvider,
  Button,
  VisibleComponent,
  AgeVerificationProvider,
} from '@shopby/react-components';
import { isAgeVerified } from '@shopby/shared';

import IdentificationVerificationBtn from '../../components/IdentificationVerificationBtn/IdentificationVerificationBtn';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import SignInForm from '../SignIn/SignInForm';

const AdultCertificationButton = () => {
  const location = useLocation();

  const handleSubmit = () => {
    window.location.replace(location.state?.from ?? '/', {
      state: {
        ...location.state,
      },
    });
  };

  useEffect(() => {
    if (isAgeVerified()) {
      window.location.replace(location.state?.from ?? '/', {
        state: {
          ...location.state,
        },
      });
    }
  }, [isAgeVerified]);

  return (
    <IdentificationVerificationBtn
      type="adultCertification"
      className="adult-certification__certification-btn"
      label="회원 성인인증"
      theme="dark"
      onSubmit={handleSubmit}
    />
  );
};

const SignInForAdultCertification = ({ onSignIn }) => {
  const location = useLocation();

  // 인트로페이지가 성인인증인 경우 "뒤로가기 처리"
  // 상품 > 성인인증인 경우 "메인으로가기 처리"
  const backPath = location.state?.isIntroPage ? -1 : '/';

  return (
    <>
      <Button
        className="adult-certification__exit-button"
        label="19세 미만 나가기"
        onClick={() => {
          if (backPath === -1) {
            window.history.go(backPath);
          } else {
            window.location.replace(backPath);
          }
        }}
      />
      <div className="l-panel adult-certification__sign-in">
        <p className="adult-certification__sign-in-title">회원 로그인</p>
        <SignInProvider>
          <OpenIdSignInProvider>
            <SignInForm usesOnlySignIn={true} onSignIn={onSignIn} />
          </OpenIdSignInProvider>
        </SignInProvider>
      </div>
    </>
  );
};

SignInForAdultCertification.propTypes = {
  onSignIn: func,
};

const AdultCertification = () => {
  const { isSignedIn } = useAuthActionContext();
  const [isMember, setIsMember] = useState(isSignedIn());

  useLayoutChanger({
    hasHomeBtnOnHeader: true,
    title: '성인 인증',
  });

  useEffect(() => {
    isMember && isAgeVerified();
  }, []);

  return (
    <div className="adult-certification">
      <div className="adult-certification__image bg bg--adult"></div>
      <p className="adult-certification__title">
        성인인증이 필요한
        <br />
        서비스입니다.
      </p>
      <p className="adult-certification__description">
        본 상품 및 내용은{' '}
        <span className="highlight">
          청소년에게 유해한 정보를 <br />
          포함하고있어 성인인증 절차를 거쳐야 합니다.
        </span>
        <br />본 상품 및 내용은 청소년유해매체물로서 정보통신망이용촉진 및 정보보호 등에 관한 법률 및 청소년 보호법의
        규정에 의하여 19세 미만의 청소년이 이용, 구매할 수 없습니다.
      </p>
      <VisibleComponent
        shows={isMember}
        TruthyComponent={
          <AgeVerificationProvider>
            <IdentificationVerificationProvider>
              <Button
                className="adult-certification__certification-btn"
                label="19세 미만 나가기"
                onClick={() => {
                  window.location.replace('/');
                }}
              />
              <AdultCertificationButton />
            </IdentificationVerificationProvider>
          </AgeVerificationProvider>
        }
        FalsyComponent={<SignInForAdultCertification onSignIn={() => setIsMember(true)} />}
      />
    </div>
  );
};
export default AdultCertification;

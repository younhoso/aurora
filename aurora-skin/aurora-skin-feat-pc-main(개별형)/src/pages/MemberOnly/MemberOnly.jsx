import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { SignInProvider, OpenIdSignInProvider } from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

import SignInForm from '../SignIn/SignInForm';

const MemberOnly = () => {
  const location = useLocation();

  const handleSignIn = () => {
    window.location.replace(location.state?.from ?? '/', {
      replace: true,
      state: {
        ...location.state,
      },
    });
  };

  useEffect(() => {
    isSignedIn() && handleSignIn();
  }, [isSignedIn]);

  return (
    <div className="member-only">
      <p className="member-only__text">
        회원 전용으로 운영되는 쇼핑몰입니다.
        <br />
        로그인/회원가입 후 이용이 가능합니다.
      </p>

      <SignInProvider>
        <OpenIdSignInProvider>
          <SignInForm usesOnlySignIn={true} onSignIn={handleSignIn} />
        </OpenIdSignInProvider>
      </SignInProvider>
    </div>
  );
};

export default MemberOnly;

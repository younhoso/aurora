import { useTranslation } from 'react-i18next';

import { SignInProvider, OpenIdSignInProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import SignInForm from './SignInForm';

const SignIn = () => {
  const { t } = useTranslation('title');

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signIn'),
  });

  return (
    <SignInProvider>
      <OpenIdSignInProvider>
        <SignInForm />
      </OpenIdSignInProvider>
    </SignInProvider>
  );
};

export default SignIn;

SignIn.propTypes = {};

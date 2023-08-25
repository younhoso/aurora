import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SignUpProvider, IdentificationVerificationProvider, AgeVerificationProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import SignUpButton from './SignUpButton';
import SignUpForm from './SignUpForm';
import TermsForm from './TermsForm';
import TermsModal from './TermsModal';

const SignUp = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUp'),
  });

  const [isTermsFullModalOpen, setIsTermsFullModalOpen] = useState(false);

  return (
    <SignUpProvider>
      <AgeVerificationProvider>
        <IdentificationVerificationProvider>
          <div className="sign-up-form">
            <SignUpForm />
            <TermsForm setIsTermsFullModalOpen={() => setIsTermsFullModalOpen(true)} />
            <SignUpButton />
          </div>
          {isTermsFullModalOpen && <TermsModal onClose={() => setIsTermsFullModalOpen(false)} />}
        </IdentificationVerificationProvider>
      </AgeVerificationProvider>
    </SignUpProvider>
  );
};

export default SignUp;

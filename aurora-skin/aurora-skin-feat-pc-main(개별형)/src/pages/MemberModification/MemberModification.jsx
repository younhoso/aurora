import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  MemberModificationProvider,
  IdentificationVerificationProvider,
  AgeVerificationProvider,
  CheckMemberPasswordProvider,
} from '@shopby/react-components';

import CheckMemberPassword from '../../components/CheckMemberPassword';
import FullModal from '../../components/FullModal';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import MemberModificationForm from './MemberModificationForm';

const MemberModification = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('memberModification'),
  });
  const [isPasswordCheckModalOpen, setIsPasswordCheckModalOpen] = useState(true);

  return (
    <MemberModificationProvider>
      <IdentificationVerificationProvider>
        <AgeVerificationProvider>
          <CheckMemberPasswordProvider>
            {isPasswordCheckModalOpen && (
              <FullModal
                title={t('memberModification')}
                onClose={() => {
                  location.href = 'my-page';
                }}
              >
                <CheckMemberPassword
                  onAuthenticationBtnClick={() => {
                    setIsPasswordCheckModalOpen(false);
                  }}
                />
              </FullModal>
            )}
            <MemberModificationForm />
          </CheckMemberPasswordProvider>
        </AgeVerificationProvider>
      </IdentificationVerificationProvider>
    </MemberModificationProvider>
  );
};

export default MemberModification;

MemberModification.propTypes = {};

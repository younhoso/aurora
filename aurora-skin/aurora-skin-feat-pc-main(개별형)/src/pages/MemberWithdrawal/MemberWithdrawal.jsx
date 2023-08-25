import { useEffect, useState } from 'react';

import {
  CheckMemberPasswordProvider,
  MemberWithdrawalProvider,
  OpenIdSignInProvider,
  useAuthStateContext,
} from '@shopby/react-components';

import CheckMemberPassword from '../../components/CheckMemberPassword';
import FullModal from '../../components/FullModal';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import CheckOpenIdMember from './CheckOpenIdMember';
import MemberWithdrawalContent from './MemberWithdrawalContent';

const MemberWithdrawal = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    hasBottomNav: true,
    title: '회원탈퇴',
  });

  const { profile } = useAuthStateContext();

  const [isCheckPasswordFullModalOpen, setIsCheckPasswordFullModalOpen] = useState(false);
  const [isCheckOpenIdMemberFullModalOpen, setIsCheckOpenIdMemberFullModalOpen] = useState(false);

  useEffect(() => {
    if (profile?.memberType === 'MALL') {
      setIsCheckPasswordFullModalOpen(true);
    } else {
      setIsCheckOpenIdMemberFullModalOpen(true);
    }
  }, [profile]);

  return (
    <MemberWithdrawalProvider>
      <CheckMemberPasswordProvider>
        <OpenIdSignInProvider>
          <MemberWithdrawalContent />
          {isCheckPasswordFullModalOpen && (
            <FullModal
              title={'회원탈퇴'}
              onClose={() => {
                location.href = 'my-page';
              }}
            >
              <CheckMemberPassword
                onAuthenticationBtnClick={() => {
                  setIsCheckPasswordFullModalOpen(false);
                }}
              />
            </FullModal>
          )}
          {isCheckOpenIdMemberFullModalOpen && (
            <FullModal
              title={'회원탈퇴'}
              onClose={() => {
                location.href = 'my-page';
              }}
            >
              <CheckOpenIdMember
                onAuthenticationBtnClick={() => {
                  setIsCheckOpenIdMemberFullModalOpen(false);
                }}
              />
            </FullModal>
          )}
        </OpenIdSignInProvider>
      </CheckMemberPasswordProvider>
    </MemberWithdrawalProvider>
  );
};

export default MemberWithdrawal;

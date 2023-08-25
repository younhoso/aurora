import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FindAccountProvider, TabsProvider, AuthenticationProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import FindPasswordContent from './FindPasswordContent';

const getTabs = () => [
  {
    value: 'EMAIL',
    label: '이메일인증',
  },
  {
    value: 'SMS',
    label: '휴대폰번호 인증',
  },
];

export const FindPassword = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: t('findPassword'),
  });

  const initialTabs = useMemo(() => getTabs(), []);

  return (
    <>
      <AuthenticationProvider>
        <FindAccountProvider>
          <TabsProvider
            initialState={{
              currentTab: 'EMAIL',
              tabs: initialTabs,
            }}
          >
            <FindPasswordContent />
          </TabsProvider>
        </FindAccountProvider>
      </AuthenticationProvider>
    </>
  );
};

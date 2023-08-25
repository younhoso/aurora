import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FindAccountProvider, TabsProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import FindIdContent from './FindIdContent';

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

export const FindId = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: t('findId'),
  });
  const initialTabs = useMemo(() => getTabs(), []);

  return (
    <>
      <FindAccountProvider>
        <TabsProvider
          initialState={{
            currentTab: 'EMAIL',
            tabs: initialTabs,
          }}
        >
          <FindIdContent />
        </TabsProvider>
      </FindAccountProvider>
    </>
  );
};

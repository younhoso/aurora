import { useTranslation } from 'react-i18next';

import { FindAccountProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import ChangePasswordContent from './ChangePasswordContent';

export const ChangePassword = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: t('findPassword'),
  });

  return (
    <>
      <FindAccountProvider>
        <ChangePasswordContent />
      </FindAccountProvider>
    </>
  );
};

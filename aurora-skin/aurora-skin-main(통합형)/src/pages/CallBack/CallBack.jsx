import { lazy } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IdentificationVerificationProvider } from '@shopby/react-components';
import { CALLBACK_TYPE } from '@shopby/shared';

const MyPayCallback = lazy(() => import('../MyPayCallback'));
const CallBackForm = lazy(() => import('./CallBackForm'));

const CallbackContent = {
  [CALLBACK_TYPE.MY_PAY_CALLBACK]: () => <MyPayCallback />,
};
const CallBack = () => {
  const [searchParams] = useSearchParams();
  const callbackType = searchParams.get('callbackType');

  return (
    <>
      {CallbackContent[callbackType]?.() ?? (
        <IdentificationVerificationProvider>
          <CallBackForm />
        </IdentificationVerificationProvider>
      )}
    </>
  );
};

export default CallBack;

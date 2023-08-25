import { useRef, useEffect } from 'react';

import {
  useIdentificationVerificationActionContext,
  useIdentificationVerificationStateContext,
} from '@shopby/react-components';

import Sanitized from '../../components/Sanitized';

const CallBackForm = () => {
  const { moveIdVerification } = useIdentificationVerificationActionContext();
  const { kcpForm } = useIdentificationVerificationStateContext();

  const params = new URLSearchParams(location.search);
  const kcpKey = params.get('key');
  const returnUrl = params.get('returnUrl');

  const formRef = useRef(null);
  const formSubmit = () => (kcpForm === null ? '' : formRef.current.querySelector('#form_auth').submit());

  useEffect(() => {
    if (kcpKey) {
      window.parent.postMessage(kcpKey);
    } else {
      moveIdVerification({ returnUrl: `${location.origin}/callback?returnUrl=${returnUrl}` });
    }
  }, [kcpKey, returnUrl]);

  useEffect(() => {
    self.name = 'auth_popup';
    formSubmit();
  }, [kcpForm]);

  return (
    <>
      <iframe
        id="kcp_cert"
        name="kcp_cert"
        frameBorder="0"
        scrolling="no"
        style={{ display: 'none', width: '100%', height: '100%' }}
        sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-popups allow-scripts allow-modals allow-forms"
      >
        <div className="form" ref={formRef}>
          <Sanitized html={kcpForm} />
        </div>
      </iframe>
      <div id="popups-area"></div>
    </>
  );
};

export default CallBackForm;

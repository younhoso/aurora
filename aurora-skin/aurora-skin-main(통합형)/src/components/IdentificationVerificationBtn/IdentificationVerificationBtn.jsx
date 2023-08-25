import { useState, useEffect, useMemo } from 'react';

import { string, func } from 'prop-types';

import {
  Button,
  CustomModal,
  useIdentificationVerificationActionContext,
  useIdentificationVerificationStateContext,
  IconBtn,
  useAgeVerificationActionContext,
} from '@shopby/react-components';

const IdentificationVerificationButton = ({ className, label, type, onSubmit, onSetNewPhoneNumber = () => {} }) => {
  const { getIdVerificationResponse, verifyCi, updateIsCiExist, updateIsIdentificationVerificationReSend, updateCi } =
    useIdentificationVerificationActionContext();
  const { isIdentificationVerificationReSend } = useIdentificationVerificationStateContext();
  const { postKcpAgeVerification } = useAgeVerificationActionContext();

  const [isIdentificationVerificationModalOpen, setIsIdentificationVerificationModalOpen] = useState(false);
  const [key, setKey] = useState(null);

  const getKcpCallbackUrl = useMemo(() => `${location.origin}/callback`, [location]);

  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || typeof event.data !== 'string') {
      return;
    }

    setKey(event.data);

    setIsIdentificationVerificationModalOpen(false);
  });

  const verifyMemberExist = async () => {
    const {
      data: { ci, phone },
    } = await getIdVerificationResponse({ key });

    updateCi(ci);

    const { data: verifyResult } = await verifyCi({ ci });

    if (type === 'memberModify' && !verifyResult.exist) onSetNewPhoneNumber(phone);

    if (verifyResult.exist) {
      updateIsCiExist(true);
    }
  };

  useEffect(() => {
    if (['signUp', 'memberModify'].includes(type) && key) {
      updateIsIdentificationVerificationReSend(true);
      verifyMemberExist();
    }

    if (key && type === 'adultCertification') {
      postKcpAgeVerification({ key }).then(({ data }) => {
        requestAnimationFrame(() => {
          onSubmit?.(data);
        });
      });
    }
  }, [key]);

  return (
    <>
      <Button
        className={className}
        label={label}
        onClick={() => {
          if (isIdentificationVerificationReSend) {
            updateIsIdentificationVerificationReSend(false);

            return;
          }
          setIsIdentificationVerificationModalOpen(true);
        }}
      />
      {isIdentificationVerificationModalOpen && (
        <CustomModal className="identification-verification-modal">
          <>
            <div className="identification-verification-modal__header">
              <h2 className="identification-verification-modal__title">휴대폰 본인인증</h2>
              <IconBtn
                className="identification-verification-modal__close-btn"
                iconType="x-black"
                onClick={() => setIsIdentificationVerificationModalOpen(false)}
              />
            </div>
            <div className="identification-verification-modal__content title-modal--full">
              <iframe src={getKcpCallbackUrl}></iframe>
            </div>
          </>
        </CustomModal>
      )}
    </>
  );
};

export default IdentificationVerificationButton;
IdentificationVerificationButton.propTypes = {
  type: string.isRequired,
  label: string,
  className: string,
  onSubmit: func,
  onSetNewPhoneNumber: func,
};

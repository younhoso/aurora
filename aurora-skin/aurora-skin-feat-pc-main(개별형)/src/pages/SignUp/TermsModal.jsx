import { useEffect } from 'react';

import { func } from 'prop-types';

import { useSignUpStateContext, useSignUpActionContext } from '@shopby/react-components';

import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized';

const TermsModal = ({ onClose }) => {
  const { getTerms, setTermsModalInfo } = useSignUpActionContext();
  const { termsModalInfo } = useSignUpStateContext();
  useEffect(() => {
    getTerms({
      termsTypes: termsModalInfo.termsType,
    });

    return () => {
      setTermsModalInfo(null);
    };
  }, []);

  if (!termsModalInfo.contents) return <></>;

  return (
    <FullModal className="agreement" title={termsModalInfo.title} onClose={onClose}>
      <Sanitized html={termsModalInfo.contents} />
    </FullModal>
  );
};

export default TermsModal;

TermsModal.propTypes = {
  onClose: func,
};

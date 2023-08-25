import { useEffect } from 'react';

import {
  Button,
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useMallStateContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';

import MemberModificationAddressForm from './MemberModificationAddressForm';
import MemberModificationEmailForm from './MemberModificationEmailForm';
import MemberModificationReceiveAgreement from './MemberModificationReceiveAgreement';
import MemberModificationSmsForm from './MemberModificationSmsForm';
import MemberModificationTermsForm from './MemberModificationTermsForm';

const MemberModificationForm = () => {
  const { fetchProfile, modifyProfile, validateTerms, validateKey, updateIsAuthenticationReSend } =
    useMemberModificationActionContext();

  const { memberModificationInfo } = useMemberModificationStateContext();
  const { mallJoinConfig } = useMallStateContext();
  const { catchError } = useErrorBoundaryActionContext();

  const handleModifyBtnClick = async () => {
    if (!validateKey()) {
      return;
    }
    if (!validateTerms()) {
      return;
    }

    try {
      const modifyResult = await modifyProfile();

      if (modifyResult) {
        location.href = '/my-page';
      }
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (mallJoinConfig.authenticationType !== AUTHENTICATION_TYPE.NOT_USED) {
      updateIsAuthenticationReSend(true);
    }
  }, [mallJoinConfig]);

  return (
    <div className="member-modification">
      <div className="member-modification-name">
        <p>
          {memberModificationInfo.memberName}
          <span>
            ({memberModificationInfo.providerType ? memberModificationInfo.providerType : '쇼핑몰'} 아이디 회원)
          </span>
        </p>
      </div>
      <section className="l-panel">
        <div className="member-modification-form">
          <MemberModificationEmailForm />
          <MemberModificationSmsForm />
          <MemberModificationAddressForm />
        </div>
      </section>
      <section className="l-panel">
        <div className="member-modification-form">
          <MemberModificationReceiveAgreement />
        </div>
      </section>
      <section className="l-panel">
        <div className="member-modification-form">
          <MemberModificationTermsForm />
          <div className="member-modification-form__button-wrap">
            <Button label="정보 수정" onClick={handleModifyBtnClick} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberModificationForm;

MemberModificationForm.propTypes = {};

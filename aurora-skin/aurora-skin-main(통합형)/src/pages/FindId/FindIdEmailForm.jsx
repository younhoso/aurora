import { useMemo } from 'react';

import {
  Button,
  useFindAccountStateContext,
  useFindAccountActionContext,
  TextField,
  SelectBox,
  EmailInput,
} from '@shopby/react-components';

import { EMAIL_DOMAIN_OPTIONS } from '../../constants/form';

export const FindIdEmailForm = () => {
  const {
    findAccountInfo: { memberName, emailId, emailDomain, domainSelectorValue },
    isNotExistMemberInfo,
  } = useFindAccountStateContext();
  const { findId, updateFindAccountInfo } = useFindAccountActionContext();

  const handleEmailIdInputChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ emailId: value });
  };

  const handleEmailDomainInputChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ emailDomain: value, domainSelectorValue: '' });
  };

  const handleEmailDomainSelect = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ emailDomain: value, domainSelectorValue: value });
  };

  const handleMemberNameChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ memberName: value });
  };
  const email = useMemo(() => `${emailId}@${emailDomain}`, [emailId, emailDomain]);

  return (
    <>
      <div className="find-id-form__item">
        <div className="find-id-form__input-wrap">
          <TextField id="memberId" value={memberName} placeholder="이름 입력" onChange={handleMemberNameChange} />
        </div>
      </div>
      <div className="find-id-form__item">
        <div className="find-id-form__input-wrap">
          <EmailInput
            id={emailId}
            domain={emailDomain}
            onIdChange={handleEmailIdInputChange}
            onDomainChange={handleEmailDomainInputChange}
          />
          <SelectBox
            hasEmptyOption={true}
            emptyOptionLabel="직접 입력"
            value={domainSelectorValue}
            onSelect={handleEmailDomainSelect}
            options={EMAIL_DOMAIN_OPTIONS}
          />
        </div>
      </div>

      {isNotExistMemberInfo && <p className="find-id-form__caution">회원정보를 찾을 수 없습니다.</p>}

      <div className="find-id-form__btn-wrap">
        <Button
          label="아이디 찾기"
          onClick={() => {
            findId({ findMethod: 'EMAIL', email, memberName });
          }}
        />
      </div>
    </>
  );
};

export default FindIdEmailForm;

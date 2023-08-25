import { useEffect } from 'react';

import {
  Button,
  Checkbox,
  useMemberModificationActionContext,
  useMemberModificationStateContext,
  useAuthStateContext,
} from '@shopby/react-components';

import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized';

const MemberModificationTermsForm = () => {
  const { profile } = useAuthStateContext();
  const { getTerms, checkSingle, updateTermsInfo, updateIsTermsContentFullModalOpen, updateTermStatus } =
    useMemberModificationActionContext();
  const { termStatus, termsInfo, isTermsContentFullModalOpen } = useMemberModificationStateContext();

  const initialTermStatus = [
    { id: 'use', label: '[필수] 이용약관', checked: true, require: true, termsType: 'USE' },
    {
      id: 'pi',
      label: '[필수] 개인정보 수집 / 이용동의',
      checked: true,
      require: true,
      termsType: 'PI_COLLECTION_AND_USE_REQUIRED',
    },
    { id: 'age', label: '[필수] 만 14세 이상입니다', checked: true, require: true },
  ];

  const handleCheckSingle = (isChecked, label) => {
    checkSingle({ isChecked, label });
  };

  const handleGetTerms = ({ termsTypes, title }) => {
    getTerms({ termsTypes });
    updateTermsInfo({ title });
  };

  useEffect(() => {
    updateTermStatus(initialTermStatus);
  }, [profile]);

  return (
    <div className="member-modification-form__item">
      <p className="member-modification-form__tit">약관동의 현황</p>

      <div className="member-modification-form__agree-wrap">
        <ul className="member-modification-form__agree-list">
          {termStatus?.map((item, idx) => (
            <li key={idx}>
              <div className="member-modification-form__checkbox--check-single">
                <Checkbox
                  label={item.label}
                  checked={item.checked}
                  onChange={() => handleCheckSingle(item.checked, item.label)}
                />
                {item.termsType && (
                  <Button
                    label="보기"
                    onClick={() => {
                      handleGetTerms({ termsTypes: item.termsType, title: item.label });
                    }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>

        {isTermsContentFullModalOpen && (
          <FullModal
            className="agreement"
            title={termsInfo.title}
            onClose={() => updateIsTermsContentFullModalOpen(false)}
          >
            <Sanitized html={termsInfo.contents} />
          </FullModal>
        )}
      </div>
    </div>
  );
};

export default MemberModificationTermsForm;

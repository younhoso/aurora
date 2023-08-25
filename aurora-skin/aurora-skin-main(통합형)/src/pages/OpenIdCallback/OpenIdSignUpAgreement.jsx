import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { string } from 'prop-types';

import { Button, Checkbox, useOpenIdSignInActionContext, useOpenIdSignInValueContext } from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const OpenIdSignUpAgreement = ({ orderSheetNo, previousPath, nextPath }) => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUpAgreement'),
  });
  const navigate = useNavigate();
  const {
    getTerms,
    openIdSignUp,
    allCheck,
    singleCheck,
    updateTermsInfo,
    updateIsTermsContentFullModalOpen,
    removePath,
    setTermStatus,
  } = useOpenIdSignInActionContext();
  const { allChecked, termStatus, termsInfo, isTermsContentFullModalOpen } = useOpenIdSignInValueContext();
  const { catchError } = useErrorBoundaryActionContext();

  const initialTermStatus = [
    { id: 'use', label: '[필수] 이용약관', checked: false, required: true, termsType: 'USE' },
    {
      id: 'pi',
      label: '[필수] 개인정보 수집 / 이용동의',
      checked: false,
      required: true,
      termsType: 'PI_COLLECTION_AND_USE_REQUIRED',
    },
    { id: 'age', label: '[필수] 만 14세 이상입니다', checked: false, required: true },
    { id: 'email', label: '[선택] 마케팅 알림 메일 수신 동의', checked: false },
    { id: 'sms', label: '[선택] 맞춤 혜택 알림 문자 수신 동의', checked: false },
  ];

  const handleAllCheck = (isChecked) => {
    allCheck(isChecked);
  };

  const handleSingleCheck = (isChecked, label) => {
    singleCheck({ isChecked, label });
  };

  const handleGetTerms = ({ termsTypes, title }) => {
    getTerms({ termsTypes });
    updateTermsInfo({ title });
  };

  const handleOpenIdSignUp = async () => {
    try {
      await openIdSignUp();

      if (orderSheetNo) {
        window.location.href = `${window.location.origin}/order/${orderSheetNo}`;
        removePath();
      } else if (nextPath === '/adult-certification') {
        navigate(`${nextPath}`, {
          state: {
            from: previousPath,
            to: nextPath,
          },
        });
        removePath();
      } else {
        navigate(`${previousPath}`, {
          state: {
            from: nextPath,
            to: previousPath,
          },
        });
        removePath();
      }
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    setTermStatus((prev) => [...initialTermStatus, ...prev]);
  }, []);

  return (
    <div className="open-id-agreement-form">
      <div className="open-id-agreement-form__input-wrap">
        <div className="open-id-agreement-form__checkbox--check-all">
          <Checkbox
            label="아래 약관에 모두 동의합니다."
            checked={allChecked}
            onChange={(e) => {
              handleAllCheck(e.target.checked);
            }}
          />
        </div>
      </div>
      <ul className="open-id-agreement-form__agree-list">
        {termStatus?.map((item, idx) => (
          <li key={idx}>
            <div className="open-id-agreement-form__checkbox--check-single">
              <Checkbox
                label={item.label}
                checked={item.checked}
                onChange={() => handleSingleCheck(item.checked, item.label)}
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

      <div className="open-id-agreement-form__confirm">
        <Button label="동의" onClick={handleOpenIdSignUp} />
      </div>
    </div>
  );
};

export default OpenIdSignUpAgreement;
OpenIdSignUpAgreement.propTypes = {
  orderSheetNo: string,
  previousPath: string,
  nextPath: string,
};

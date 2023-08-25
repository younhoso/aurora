import { useEffect } from 'react';

import { func } from 'prop-types';

import { useSignUpActionContext, useSignUpStateContext, Checkbox, Button } from '@shopby/react-components';

const TermsForm = ({ setIsTermsFullModalOpen }) => {
  const { checkboxModalToggle, checkboxSingleCheck, checkboxAllCheck, setTermStatus } = useSignUpActionContext();
  const { termStatus } = useSignUpStateContext();

  const initialTermStatus = [
    {
      id: 'use',
      title: '[필수] 이용약관',
      checked: false,
      require: true,
      hasDetailView: true,
      termsType: 'USE',
      isFullModalOpen: false,
    },
    {
      id: 'ci',
      title: '[필수] 개인정보 수집 / 이용동의',
      checked: false,
      require: true,
      hasDetailView: true,
      termsType: 'PI_COLLECTION_AND_USE_REQUIRED',
      isFullModalOpen: false,
    },
    { id: 'age', title: '[필수] 만 14세 이상입니다', checked: false, require: true },
  ];

  const handleModalToggle = (id) => checkboxModalToggle(id);
  const handleSingleCheck = (checked, id) => checkboxSingleCheck(checked, id);
  const handleAllCheck = (checked) => checkboxAllCheck(checked);

  useEffect(() => {
    setTermStatus(initialTermStatus);
  }, []);

  return (
    <>
      <div className="sign-up-form__item sign-up-form__agree-wrap">
        <p className="sign-up-form__tit">약관동의</p>
        <div className="sign-up-form__input-wrap">
          <div className="sign-up-form__checkbox--all">
            <Checkbox
              onChange={(e) => {
                handleAllCheck(e.target.checked);
              }}
              checked={termStatus.every((el) => el.checked)}
              name="checkAll"
              label={'아래 약관에 모두 동의합니다.'}
            />
          </div>
          <ul className="sign-up-form__agree-list">
            {termStatus?.map((item) => (
              <li key={item.id}>
                <div className="sign-up-form__checkbox--partial">
                  <Checkbox
                    onChange={(e) => {
                      handleSingleCheck(e.target.checked, item.id);
                    }}
                    checked={item.checked}
                    label={item.title}
                  />
                  {item.hasDetailView && (
                    <Button
                      label={'보기'}
                      onClick={() => {
                        handleModalToggle(item.id);
                        setIsTermsFullModalOpen();
                      }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="notice-list">
        <p className="notice-list__item">
          주문, 결제, 고객 상담 등 원활한 정보 제공을 위해 이메일 주소 및 휴대폰 번호는 정확히 기입하셔야 합니다.
        </p>
      </div>
    </>
  );
};

export default TermsForm;

TermsForm.propTypes = {
  setIsTermsFullModalOpen: func,
};

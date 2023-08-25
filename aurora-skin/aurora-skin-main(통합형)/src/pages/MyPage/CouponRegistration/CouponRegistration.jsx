import { useState } from 'react';

import { func } from 'prop-types';

import { Button, CouponIssuanceByCodeButton, TextField } from '@shopby/react-components';

const CouponRegistration = ({ onCancel, onRegister, onChange }) => {
  const [code, setCode] = useState('');

  const handleCodeChange = (event) => {
    setCode(event.currentTarget.value?.trim());

    onChange?.(event);
  };

  const handleCancel = () => {
    setCode('');

    onCancel?.();
  };

  const handleRegister = () => {
    setCode('');

    onRegister?.();
  };

  return (
    <div className="my-page-coupon-registration">
      <div className="my-page-coupon-registration__title">발급 받으신 쿠폰 인증 번호를 아래에 입력해주세요.</div>
      <TextField value={code} onChange={handleCodeChange} placeholder="쿠폰 번호를 입력하세요." />
      <div className="my-page-coupon-registration__buttons">
        <Button theme="dark" label="취소" onClick={handleCancel} />
        <CouponIssuanceByCodeButton onClick={handleRegister} code={code} />
      </div>
    </div>
  );
};

export default CouponRegistration;

CouponRegistration.propTypes = {
  onCancel: func,
  onRegister: func,
  onChange: func,
};

import { useState } from 'react';

import { checkPassword } from '@shopby/shared';

const INVALID_PASSWORD_MESSAGE_MAP = {
  MUST_CONTAIN_THREE_TYPES_IN_LENGTH_LESS_THAN_10:
    '비밀번호는 영문, 숫자, 특수문자를 3종류 모두 조합하여 8~20자로 입력해주세요.',
  MUST_CONTAIN_TWO_TYPES_IN_LENGTH_MORE_THAN_10:
    '비밀번호는 영문, 숫자, 특수문자를 2종류 이상 조합하여 10~20자로 입력해주세요.',
  LENGTH_IS_INVALID: '비밀번호는 영문, 숫자, 특수문자를 3종류 모두 조합하여 8~20자로 입력해주세요.',
  INVALID_SPECIAL: '비밀번호 특수문자는 !@#$%^&*+=-_.()만 사용 가능합니다.',
};

const useChangePassword = () => {
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState('');

  const handleChangePassword = ({ currentTarget: { value } }) => {
    setPassword(value);
  };

  const validatePassword = () => {
    const { isValid, message } = checkPassword(password);

    setIsValid(isValid);
    setMessage(INVALID_PASSWORD_MESSAGE_MAP[message]);
  };

  return {
    password,
    handleChangePassword,
    validatePassword,
    isValid,
    message,
  };
};

export default useChangePassword;

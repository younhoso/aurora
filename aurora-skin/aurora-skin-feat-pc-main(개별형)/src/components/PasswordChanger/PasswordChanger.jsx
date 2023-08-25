import { useState, useEffect } from 'react';

import { bool, func } from 'prop-types';

import {
  VisibleComponent,
  Button,
  TextField,
  useModalActionContext,
  useCheckMemberPasswordActionContext,
  useSignInActionContext,
} from '@shopby/react-components';

import useChangePassword from '../../hooks/useChangePassword';
import { useErrorBoundaryActionContext } from '../ErrorBoundary';

const PasswordChanger = ({ useNextChanger = false, onSubmit, onNext }) => {
  const { changePassword } = useSignInActionContext();
  const { openAlert } = useModalActionContext();

  const { checkPassword } = useCheckMemberPasswordActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const currentPasswordChanger = useChangePassword();
  const newPasswordChanger = useChangePassword();
  const newPasswordCheckChanger = useChangePassword();

  const [isInvalidPasswordCheck, setIsInvalidPasswordCheck] = useState(false);

  const getInvalidMessage = () => {
    if (!currentPasswordChanger.password) return '현재 비밀번호를 입력해주세요.';

    if (!newPasswordChanger.password) return '새로운 비밀번호를 입력해주세요.';

    if (newPasswordChanger.password !== newPasswordCheckChanger.password)
      return '비밀번호와 비밀번호 확인 값이 일치하지 않습니다.';

    if (!newPasswordChanger.isValid) return newPasswordChanger.message;

    return '';
  };

  const handleSubmit = async () => {
    newPasswordChanger.validatePassword();

    const invalidMessage = getInvalidMessage();

    if (invalidMessage) {
      openAlert({
        message: invalidMessage,
      });

      return;
    }

    try {
      await checkPassword(currentPasswordChanger.password);
      await changePassword({
        currentPassword: currentPasswordChanger.password,
        newPassword: newPasswordChanger.password,
        willChangeNextTime: false,
      });

      openAlert({
        message: '회원님의 비밀번호가 안전하게 변경되었습니다.',
        onClose: () => {
          onSubmit?.();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleNext = async () => {
    try {
      await changePassword({
        willChangeNextTime: true,
      });

      openAlert({
        message: '해당 안내는 90일 뒤에 다시 안내됩니다.',
        onClose: () => {
          onNext?.();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    setIsInvalidPasswordCheck(newPasswordChanger.password !== newPasswordCheckChanger.password);
  }, [newPasswordChanger.password, newPasswordCheckChanger.password]);

  return (
    <>
      <div className="password-changer">
        <TextField
          className="password-changer__current"
          placeholder="현재 비밀번호"
          type="password"
          value={currentPasswordChanger.password}
          onChange={currentPasswordChanger.handleChangePassword}
        />
        <hr />
        <TextField
          className="password-changer__new"
          placeholder="새 비밀번호"
          value={newPasswordChanger.password}
          type="password"
          onChange={newPasswordChanger.handleChangePassword}
          onBlur={newPasswordChanger.validatePassword}
          valid="NO_SPACE"
        />
        <VisibleComponent
          shows={!newPasswordChanger.isValid}
          TruthyComponent={<p className="password-changer__caution">{newPasswordChanger.message}</p>}
        />
        <TextField
          className="password-changer__new-check"
          placeholder="새 비밀번호 확인"
          value={newPasswordCheckChanger.password}
          type="password"
          onChange={newPasswordCheckChanger.handleChangePassword}
          valid="NO_SPACE"
        />
        <VisibleComponent
          shows={isInvalidPasswordCheck}
          TruthyComponent={
            <p className="password-changer__caution">비밀번호와 비밀번호 확인 값이 일치하지 않습니다.</p>
          }
        />
      </div>
      <div className="password-changer__buttons">
        <VisibleComponent
          shows={useNextChanger}
          TruthyComponent={<Button theme="dark" label="다음에 변경" onClick={handleNext} />}
        />
        <Button theme="caution" label="비밀번호 변경" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default PasswordChanger;

PasswordChanger.propTypes = {
  useNextChanger: bool,
  onSubmit: func,
  onNext: func,
};

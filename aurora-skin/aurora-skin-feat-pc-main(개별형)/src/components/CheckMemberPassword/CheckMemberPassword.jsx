import { useEffect } from 'react';

import { func } from 'prop-types';

import {
  Button,
  useCheckMemberPasswordStateContext,
  useCheckMemberPasswordActionContext,
  useAuthStateContext,
  TextField,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../ErrorBoundary';

const CheckMemberPassword = ({ onAuthenticationBtnClick }) => {
  const { updateCheckPasswordMemberInfo, checkPassword } = useCheckMemberPasswordActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const {
    checkPasswordMemberInfo: { memberId, password },
  } = useCheckMemberPasswordStateContext();

  const { profile } = useAuthStateContext();

  const handlePasswordChange = ({ currentTarget: { value } }) => {
    updateCheckPasswordMemberInfo({ password: value });
  };

  const handlePasswordKeyDown = async (e) => {
    try {
      if (e.key === 'Enter') {
        await checkPassword(password);
        onAuthenticationBtnClick();
      }
    } catch (e) {
      catchError(e);
    }
  };

  const checkPasswordBtnClick = async (password) => {
    try {
      await checkPassword(password);
      onAuthenticationBtnClick();
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    updateCheckPasswordMemberInfo({ memberId: profile?.memberId });
  }, [profile]);

  return (
    <div className="password-authentication">
      <p className="password-authentication__info-text">
        회원님의 정보를 안전하게 보호하기 위해 <br />
        다시 한 번 입력해 주세요.
      </p>
      <div className="password-authentication-form">
        <div className="password-authentication-form__item">
          <label htmlFor="mobileNo" className="password-authentication-form__tit">
            아이디
          </label>
          <div className="password-authentication-form__input-wrap">
            <TextField name="memberId" placeholder="아이디" value={memberId} disabled={true} />
          </div>
        </div>
        <div className="password-authentication-form__item">
          <label htmlFor="mobileNo" className="password-authentication-form__tit">
            비밀번호
          </label>
          <div className="password-authentication-form__input-wrap">
            <TextField
              name="password"
              placeholder="비밀번호"
              onChange={handlePasswordChange}
              value={password}
              type="password"
              valid="NO_SPACE"
              onKeyDown={handlePasswordKeyDown}
            />
          </div>
        </div>

        <div className="password-authentication__button-wrap">
          <Button
            label="취소"
            onClick={() => {
              location.href = `/my-page`;
            }}
          />
          <Button
            label="인증하기"
            onClick={() => {
              checkPasswordBtnClick(password);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckMemberPassword;

CheckMemberPassword.propTypes = {
  onAuthenticationBtnClick: func,
};

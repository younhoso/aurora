import { Link } from 'react-router-dom';

export const ChangePasswordConfirm = () => (
  <div className="change-password-confirm">
    <p className="change-password-confirm__tit">비밀번호가 변경되었습니다.</p>

    <div className="change-password-confirm__link-wrap">
      <Link to="/sign-in">로그인</Link>
    </div>
  </div>
);

export default ChangePasswordConfirm;

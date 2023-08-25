import { Link } from 'react-router-dom';

import { useFindAccountStateContext } from '@shopby/react-components';

export const FindIdResult = () => {
  const {
    findAccountInfo: { memberName },
    resultAccountInfo,
  } = useFindAccountStateContext();

  const dormant = resultAccountInfo.map((item) =>
    item.status === 'DORMANT' || item.status === 'FREEZE' ? '(휴면)' : ''
  );

  return (
    <div className="find-id-result">
      <p className="find-id-result__tit">{memberName} 회원님의 아이디입니다.</p>

      {resultAccountInfo.map((item, index) => (
        <p key={item.memberId} className="find-id-result__id-text">
          {item.memberId}
          <span className="find-id-result__dormant-text">{dormant[index]}</span>
        </p>
      ))}
      <div className="find-id-result__link-wrap">
        <Link to="/find-password" className="find-id-result__link find-id-result__link--password">
          비밀번호 찾기
        </Link>
        <Link to="/sign-in" className="find-id-result__link find-id-result__link--login">
          로그인
        </Link>
      </div>
    </div>
  );
};

export default FindIdResult;

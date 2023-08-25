import { useNavigate } from 'react-router-dom';

import { Button, useMallStateContext } from '@shopby/react-components';

const NotFound = () => {
  const {
    mall: { serviceCenter },
  } = useMallStateContext();

  const navigate = useNavigate();

  return (
    <div className="not-found">
      <p className="not-found__title">Not found.</p>
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <p>
        오류 관련 문의는 <span>{serviceCenter.phoneNo}</span>로 <br />
        연락하시기 바랍니다.
      </p>
      <p>서비스 이용에 불편을 드려 죄송합니다.</p>

      <div className="not-found__btns">
        <Button theme="dark" label="홈 바로가기" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default NotFound;

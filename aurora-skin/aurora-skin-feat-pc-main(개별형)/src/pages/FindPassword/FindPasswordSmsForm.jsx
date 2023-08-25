import { Link } from 'react-router-dom';

import { Button, useFindAccountStateContext, useFindAccountActionContext, TextField } from '@shopby/react-components';

import FullModal from '../../components/FullModal';

import FindPasswordAuthentication from './FindPasswordAuthentication';

export const FindPasswordSmsForm = () => {
  const {
    findAccountInfo: { memberId },
    isNotExistMemberInfo,
    isFindPasswordFullModalOpen,
  } = useFindAccountStateContext();
  const { updateFindAccountInfo, searchAccount, setIsFindPasswordFullModalOpen } = useFindAccountActionContext();

  const handleMemberIdChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ memberId: value });
  };

  const handleFindPasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchAccount({ memberId });
    }
  };

  return (
    <>
      <div className="find-password-form__item">
        <div className="find-password-form__input-wrap">
          <TextField
            id="memberId"
            value={memberId}
            placeholder="아이디 입력"
            onChange={handleMemberIdChange}
            valid="NO_SPACE"
            onKeyDown={handleFindPasswordKeyDown}
          />
        </div>
      </div>

      {isNotExistMemberInfo && <p className="find-password-form__caution">회원정보를 찾을 수 없습니다.</p>}

      <div className="find-password-form__btn-wrap">
        <Link to="/find-id">아이디 찾기</Link>
        <Button
          label="비밀번호 찾기"
          onClick={() => {
            searchAccount({ memberId });
          }}
        />
      </div>

      {isFindPasswordFullModalOpen && (
        <FullModal title="비밀번호 찾기" onClose={() => setIsFindPasswordFullModalOpen(false)}>
          <FindPasswordAuthentication type="SMS" />
        </FullModal>
      )}
    </>
  );
};

export default FindPasswordSmsForm;

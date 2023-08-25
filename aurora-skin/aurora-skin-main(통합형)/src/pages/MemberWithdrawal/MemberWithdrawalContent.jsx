import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  useAuthStateContext,
  useAuthActionContext,
  useMemberWithdrawalActionContext,
  useMemberWithdrawalStateContext,
  useModalActionContext,
  TextField,
  Checkbox,
} from '@shopby/react-components';

import Sanitized from '../../components/Sanitized';

const MemberWithdrawalContent = () => {
  const { profile } = useAuthStateContext();
  const { isSignedIn } = useAuthActionContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { deleteMember, fetchWithdrawalTermsContent } = useMemberWithdrawalActionContext();
  const { terms } = useMemberWithdrawalStateContext();

  const navigate = useNavigate();

  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [withdrawalAgreement, setWithdrawalAgreement] = useState(false);

  const handleWithdrawalReasonChange = ({ currentTarget: { value } }) => {
    setWithdrawalReason(value);
  };

  const handleWithdrawalAgreementChange = (event) => {
    event.target.checked ? setWithdrawalAgreement(true) : setWithdrawalAgreement(false);
  };

  const handleDeleteMember = () => {
    const used = terms?.WITHDRAWAL_GUIDE?.used;
    if (used && !withdrawalAgreement) {
      openAlert({
        message: '회원탈퇴 동의 후 탈퇴가 가능합니다.',
      });

      return;
    }

    if (withdrawalReason === '') {
      openAlert({
        message: '탈퇴 사유를 입력해주세요.',
      });

      return;
    }

    openConfirm({
      message: (
        <>
          회원 탈퇴를 진행하시겠습니까?
          <br />
          확인 클릭 시 복구가 불가능합니다.
        </>
      ),
      confirmLabel: '확인',
      onConfirm: async () => {
        await deleteMember({ reason: withdrawalReason });
        location.replace('/');
      },
      cancelLabel: '취소',
      onCancel: () => null,
    });
  };

  useEffect(() => {
    fetchWithdrawalTermsContent(['WITHDRAWAL_GUIDE']);
  }, []);

  if (!isSignedIn()) {
    openAlert({
      message: '먼저 로그인을 해주세요.',
      onClose: () => {
        navigate('/sign-in', { replace: true });
      },
    });

    return <></>;
  }

  return (
    <div className="member-withdrawal">
      <div className="member-withdrawal-form">
        <div className="member-withdrawal-form__item">
          <label htmlFor="memberId" className="member-withdrawal-form__tit">
            {profile?.providerType ? profile.providerType.replace('_', '-') : '일반'} 아이디 회원
          </label>
          <div className="member-withdrawal-form__input-wrap">
            <TextField value={profile?.memberId ? profile.memberId : ''} readOnly={true} />
          </div>
        </div>
        <div className="member-withdrawal-form__item">
          <div className="member-withdrawal-form__input-wrap">
            <textarea
              id="member-withdrawal-reason"
              name="reason"
              placeholder="탈퇴 사유를 입력해주세요."
              onChange={handleWithdrawalReasonChange}
              value={withdrawalReason}
            />
          </div>
        </div>
      </div>
      {terms?.WITHDRAWAL_GUIDE?.used && (
        <div className="member-withdrawal__terms-content">
          <Sanitized html={terms.WITHDRAWAL_GUIDE.contents} />
        </div>
      )}
      {terms?.WITHDRAWAL_GUIDE?.used && (
        <div className="member-withdrawal__check-wrap">
          <Checkbox checked={withdrawalAgreement} onChange={handleWithdrawalAgreementChange}>
            <span className="checkbox-text">
              회원탈퇴 시 처리사항 안내 내용을
              <br />
              확인하였으며, 회원탈퇴에 동의합니다.
            </span>
          </Checkbox>
        </div>
      )}
      <div className="member-withdrawal__btn-wrap">
        <Button className="apply" label="탈퇴 신청" onClick={handleDeleteMember} />
        <Button
          className="cancel"
          label="취소"
          onClick={() => {
            location.href = '/my-page';
          }}
        />
      </div>
    </div>
  );
};

export default MemberWithdrawalContent;

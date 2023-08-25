import { useNavigate } from 'react-router-dom';

import { string, func } from 'prop-types';

import { Button, useClaimActionContext, useModalActionContext } from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';

const ClaimButtons = ({ claimTypeLabel, validate, orderNo }) => {
  const navigate = useNavigate();
  const { claim } = useClaimActionContext();
  const { openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const handleClaimBtnClick = async () => {
    try {
      if (!validate?.()) return;
      await claim();

      openAlert({
        message: `${claimTypeLabel} 신청이 완료되었습니다.`,
        onClose: () => {
          navigate(`/orders/${orderNo}`);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleCancelBtnClick = () => {
    navigate(-1);
  };

  return (
    <div className="claim__section claim__section--no-padding claim__btns">
      <Button className="claim__btn" label="취소하기" onClick={handleCancelBtnClick} />
      <Button className="claim__btn claim__btn--claim" label={`${claimTypeLabel} 신청`} onClick={handleClaimBtnClick} />
    </div>
  );
};

export default ClaimButtons;

ClaimButtons.propTypes = {
  claimTypeLabel: string.isRequired,
  validate: func,
  orderNo: string.isRequired,
};

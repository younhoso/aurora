import { useMemberModificationStateContext, useMemberModificationActionContext, Radio } from '@shopby/react-components';

const MemberModificationReceiveAgreement = () => {
  const { updateMemberModificationInfo } = useMemberModificationActionContext();

  const {
    memberModificationInfo: { smsAgreed, directMailAgreed },
    receiveAgreementInfo: { smsAgreeYmdt, directMailAgreeYmdt, directMailDisagreeYmdt, smsDisagreeYmdt },
  } = useMemberModificationStateContext();

  const handleSmsAgreedChange = (boolean) => {
    updateMemberModificationInfo({ smsAgreed: boolean });
  };
  const handleDirectMailAgreedChange = (boolean) => {
    updateMemberModificationInfo({ directMailAgreed: boolean });
  };

  return (
    <>
      <div className="member-modification-form__item member-modification-form__radio-field">
        <div className="radio-field__content">
          <label htmlFor="email" className="member-modification-form__tit">
            SMS 수신
          </label>
          <div className="member-modification-form__input-wrap">
            <Radio
              label="수신동의"
              checked={smsAgreed}
              onChange={() => {
                handleSmsAgreedChange(true);
              }}
            />
            <Radio
              label="동의안함"
              checked={!smsAgreed}
              onChange={() => {
                handleSmsAgreedChange(false);
              }}
            />
          </div>
        </div>

        {smsAgreeYmdt && <p className="receive-agreement-time">수신동의하신 시간 : {smsAgreeYmdt}</p>}
        {smsDisagreeYmdt && <p className="receive-agreement-time">수신거부하신 시간 : {smsDisagreeYmdt}</p>}
        <span className="member-modification-form__description">* 상품/이벤트 정보 수신동의</span>
      </div>
      <div className="member-modification-form__item member-modification-form__radio-field">
        <div className="radio-field__content">
          <label htmlFor="email" className="member-modification-form__tit">
            E-Mail 수신
          </label>
          <div className="member-modification-form__input-wrap">
            <Radio
              label="수신동의"
              checked={directMailAgreed}
              onChange={() => {
                handleDirectMailAgreedChange(true);
              }}
            />
            <Radio
              label="동의안함"
              checked={!directMailAgreed}
              onChange={() => {
                handleDirectMailAgreedChange(false);
              }}
            />
          </div>
        </div>
        {directMailAgreeYmdt && <p className="receive-agreement-time">수신동의하신 시간 : {directMailAgreeYmdt}</p>}
        {directMailDisagreeYmdt && (
          <p className="receive-agreement-time">수신거부하신 시간 : {directMailDisagreeYmdt}</p>
        )}
        <span className="member-modification-form__description">* 상품/이벤트 정보 수신동의</span>
      </div>
    </>
  );
};

export default MemberModificationReceiveAgreement;

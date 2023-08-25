import {
  Button,
  useFindAccountStateContext,
  useFindAccountActionContext,
  TextField,
  PhoneNumberInput,
  useModalActionContext,
} from '@shopby/react-components';

export const FindIdSmsForm = () => {
  const {
    findAccountInfo: { memberName, carrierNumber, firstSerial, secondSerial },
    isNotExistMemberInfo,
  } = useFindAccountStateContext();
  const { findId, updateFindAccountInfo } = useFindAccountActionContext();
  const { openAlert } = useModalActionContext();

  const mobileNo = `${carrierNumber}${firstSerial}${secondSerial}`;

  const handlePhoneCarrierNumberSelect = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ carrierNumber: value });
  };

  const handlePhoneFirstSerialNumberChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ firstSerial: value });
  };

  const handlePhoneSecondSerialNumberChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ secondSerial: value });
  };
  const handleMemberNameChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ memberName: value });
  };

  const onValidateInputData = () => {
    if (!memberName) {
      openAlert({
        message: '이름을 입력해주세요',
      });

      return;
    }

    if (mobileNo.length < 10) {
      openAlert({
        message: '휴대폰번호를 입력해주세요',
      });

      return;
    }

    findId({ findMethod: 'SMS', mobileNo, memberName });
  };

  return (
    <>
      <div className="find-id-form__item">
        <div className="find-id-form__input-wrap">
          <TextField id="memberName" value={memberName} placeholder="이름 입력" onChange={handleMemberNameChange} />
        </div>
      </div>
      <div className="find-id-form__item">
        <div className="find-id-form__input-wrap">
          <PhoneNumberInput
            name="mobileNo"
            id="mobileNo"
            carrierNumber={carrierNumber}
            firstSerial={firstSerial}
            secondSerial={secondSerial}
            onCarrierNumberSelect={handlePhoneCarrierNumberSelect}
            onFirstSerialChange={handlePhoneFirstSerialNumberChange}
            onSecondSerialChange={handlePhoneSecondSerialNumberChange}
          />
        </div>
      </div>

      {isNotExistMemberInfo && <p className="find-id-form__caution">회원정보를 찾을 수 없습니다.</p>}

      <div className="find-id-form__btn-wrap">
        <Button label="아이디 찾기" onClick={onValidateInputData} />
      </div>
    </>
  );
};

export default FindIdSmsForm;

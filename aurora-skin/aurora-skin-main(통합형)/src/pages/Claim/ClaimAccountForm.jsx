import { shape, object } from 'prop-types';

import { SelectBox, TextField, useClaimActionContext, useClaimStateContext } from '@shopby/react-components';

import { BANK_OPTIONS, INVOICE_NO_MAX_LENGTH, NAME_INPUT_MAX_LENGTH } from '../../constants/form';

const ClaimAccountForm = ({ refs }) => {
  const { bankSelectRef, bankAccountInputRef, bankDepositorNameInputRef } = refs ?? {};

  const {
    accountForRefund: { bank, bankAccount, bankDepositorName },
  } = useClaimStateContext();
  const { updateAccountForRefund } = useClaimActionContext();

  const handleBankSelect = ({ currentTarget: { value: bank } }) => {
    updateAccountForRefund({ bank });
  };

  const handleBankAccountTextFieldChange = ({ currentTarget: { value: bankAccount } }) => {
    updateAccountForRefund({ bankAccount });
  };

  const handleBankDepositorNameTextFieldChange = ({ currentTarget: { value: bankDepositorName } }) => {
    updateAccountForRefund({ bankDepositorName });
  };

  return (
    <section className="claim__section claim__account">
      <p className="claim__title">입금 받으실 계좌</p>
      <ul className="claim__account-inputs">
        <li>
          <label htmlFor="bankSelect">은행</label>
          <SelectBox
            ref={bankSelectRef}
            id="bankSelect"
            options={BANK_OPTIONS}
            className="claim__select-box"
            hasEmptyOption={true}
            emptyOptionLabel="은행사를 선택하세요."
            value={bank}
            onSelect={handleBankSelect}
          />
        </li>
        <li>
          <label htmlFor="bankAccountInput">계좌번호</label>
          <TextField
            id="bankAccountInput"
            ref={bankAccountInputRef}
            placeholder="'-' 없이 입력하세요."
            value={bankAccount}
            onChange={handleBankAccountTextFieldChange}
            valid={'NUMBER'}
            maxLength={INVOICE_NO_MAX_LENGTH}
          />
        </li>
        <li>
          <label htmlFor="bankDepositorNameTextField">예금주</label>
          <TextField
            id="bankDepositorNameTextField"
            ref={bankDepositorNameInputRef}
            placeholder="예금주를 입력하세요."
            value={bankDepositorName}
            onChange={handleBankDepositorNameTextFieldChange}
            maxLength={NAME_INPUT_MAX_LENGTH}
          />
        </li>
      </ul>
    </section>
  );
};

export default ClaimAccountForm;

ClaimAccountForm.propTypes = {
  refs: shape({
    bankSelectRef: object,
    bankAccountInputRef: object,
    bankDepositorNameInputRef: object,
  }),
};

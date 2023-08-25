import { useMemo } from 'react';

import { shape, object } from 'prop-types';

import {
  PhoneNumberInput,
  Radio,
  SelectBox,
  TextField,
  useClaimActionContext,
  useClaimStateContext,
  useMallStateContext,
} from '@shopby/react-components';
import { parsePhoneNumber } from '@shopby/shared';

import AddressForm from '../../components/AddressForm';
import {
  DELIVERY_COMPANY_OPTIONS,
  DELIVERY_MEMO_MAX_LENGTH,
  INVOICE_NO_MAX_LENGTH,
  NAME_INPUT_MAX_LENGTH,
  PHONE_CARRIER_NUMBERS_BY_STRING,
  PHONE_NUMBER_INPUT_SECTIONS,
  RETURN_WAY_OPTIONS,
} from '../../constants/form';

const CollectionInfoForm = ({ refs }) => {
  const { receiverNameInputRef, searchZipCodeBtnRef, mobilePhoneNumberInputRef, phoneNumberInputRef } = refs ?? {};

  const {
    claimInfo,
    returnWay,
    returnAddress: {
      receiverName,
      receiverContact1,
      receiverContact2,
      receiverZipCd,
      receiverAddress,
      receiverDetailAddress,
      deliveryMemo,
    },
    buyerReturnInfo: { deliveryCompany, invoiceNo },
  } = useClaimStateContext();
  const { mallName } = useMallStateContext();

  const isMallShippingArea = claimInfo.originalOption?.shippingAreaType === 'MALL_SHIPPING_AREA';

  const { updateReturnWay, updateReturnAddress, updateBuyerReturnInfo } = useClaimActionContext();

  const returnWarehouse = useMemo(() => {
    const { receiverName = '', contact = '', summary = '' } = claimInfo?.returnWarehouse ?? {};
    const dashedContact = contact ? Object.values(parsePhoneNumber(contact, { isWithDash: false })).join('-') : '';
    return {
      receiverName,
      contact: dashedContact,
      summary,
    };
  }, [claimInfo]);

  const handleReceiverNameTextFieldChange = ({ currentTarget: { value } }) => {
    updateReturnAddress({ receiverName: value });
  };

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    updateReturnAddress({ receiverDetailAddress: '' });
    updateReturnAddress({ receiverZipCd: zipCode, receiverAddress: roadAddress, receiverJibunAddress: jibunAddress });
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    updateReturnAddress({ receiverDetailAddress: addressDetail });
  };

  const handleMobilePhoneNumberChange = ({ currentTarget: { value } }, type) => {
    if (PHONE_NUMBER_INPUT_SECTIONS.includes(type)) {
      updateReturnAddress({
        receiverContact1: {
          [type]: value,
        },
      });
    }
  };

  const handlePhoneNumberChange = ({ currentTarget: { value } }, type) => {
    if (PHONE_NUMBER_INPUT_SECTIONS.includes(type)) {
      updateReturnAddress({
        receiverContact2: {
          [type]: value,
        },
      });
    }
  };

  const handleDeliveryMemoTextFieldChange = ({ currentTarget: { value: deliveryMemo } }) => {
    updateReturnAddress({ deliveryMemo });
  };

  const handleDeliveryCompanySelect = ({ currentTarget: { value: deliveryCompany } }) => {
    updateBuyerReturnInfo({ deliveryCompany });
  };

  const handleInvoiceNoTextFieldChange = ({ currentTarget: { value: invoiceNo } }) => {
    updateBuyerReturnInfo({ invoiceNo });
  };

  return (
    <section className="claim__section claim__section--no-padding claim__address">
      <p className="claim__title">반품 수거 정보</p>
      <div className="claim__address-form">
        <div className="claim__address-form-item">
          <p className="claim__address-form-title">반품 수거 방법</p>
          <div className="claim__radio-wrap">
            {RETURN_WAY_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                className={`claim__radio${option.value === returnWay ? ' claim__radio--checked' : ''}`}
                name="collection-method"
                {...option}
                checked={option.value === returnWay}
                onChange={() => updateReturnWay(option.value)}
              />
            ))}
          </div>
        </div>

        {returnWay === 'SELLER_COLLECT' && (
          <>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">반품자명</p>
              <TextField
                ref={receiverNameInputRef}
                value={receiverName}
                onChange={handleReceiverNameTextFieldChange}
                maxLength={NAME_INPUT_MAX_LENGTH}
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">수거지 주소</p>
              <AddressForm
                ref={searchZipCodeBtnRef}
                zipCode={receiverZipCd}
                address={receiverAddress}
                addressDetail={receiverDetailAddress}
                onAddressItemClick={handleAddressItemClick}
                onAddressDetailChange={handleAddressDetailChange}
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">휴대폰 번호</p>
              <PhoneNumberInput
                ref={mobilePhoneNumberInputRef}
                carrierNumber={receiverContact1?.carrierNumber}
                firstSerial={receiverContact1?.firstSerial}
                secondSerial={receiverContact1?.secondSerial}
                onCarrierNumberSelect={(e) => handleMobilePhoneNumberChange(e, 'carrierNumber')}
                onFirstSerialChange={(e) => handleMobilePhoneNumberChange(e, 'firstSerial')}
                onSecondSerialChange={(e) => handleMobilePhoneNumberChange(e, 'secondSerial')}
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">전화 번호</p>
              <PhoneNumberInput
                ref={phoneNumberInputRef}
                carrierNumbersByString={PHONE_CARRIER_NUMBERS_BY_STRING}
                carrierNumber={receiverContact2?.carrierNumber}
                firstSerial={receiverContact2?.firstSerial}
                secondSerial={receiverContact2?.secondSerial}
                onCarrierNumberSelect={(e) => handlePhoneNumberChange(e, 'carrierNumber')}
                onFirstSerialChange={(e) => handlePhoneNumberChange(e, 'firstSerial')}
                onSecondSerialChange={(e) => handlePhoneNumberChange(e, 'secondSerial')}
              />
            </div>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">수거 시 참고 사항</p>
              <TextField
                placeholder="수거 시 요청사항을 입력해주세요."
                value={deliveryMemo}
                onChange={handleDeliveryMemoTextFieldChange}
                maxLength={DELIVERY_MEMO_MAX_LENGTH}
              />
            </div>
          </>
        )}

        {returnWay === 'BUYER_DIRECT_RETURN' && (
          <>
            <div className="claim__address-form-item">
              <p className="claim__address-form-title">반품 주소지</p>
              <dl className="claim__return-address">
                <dt>이름</dt>
                <dd>{isMallShippingArea ? mallName : returnWarehouse.receiverName}</dd>
                <dt>주소</dt>
                <dd>{returnWarehouse.summary}</dd>
                <dt>전화번호</dt>
                <dd>{returnWarehouse.contact}</dd>
              </dl>
            </div>
            <div className="claim__address-form-item ">
              <p className="claim__address-form-title">반품 접수 정보</p>
              <SelectBox
                className="claim__select-box"
                hasEmptyOption={true}
                emptyOptionLabel="택배사를 선택하세요"
                options={DELIVERY_COMPANY_OPTIONS}
                value={deliveryCompany}
                onSelect={handleDeliveryCompanySelect}
              />
              <TextField
                placeholder="송장번호"
                value={invoiceNo}
                maxLength={INVOICE_NO_MAX_LENGTH}
                onChange={handleInvoiceNoTextFieldChange}
                valid={'NUMBER'}
              />
              <p className="claim__address-form-tip">※ 반품 접수 정보 입력은 필수가 아닙니다.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CollectionInfoForm;

CollectionInfoForm.propTypes = {
  refs: shape({
    receiverNameInputRef: object,
    searchZipCodeBtnRef: object,
    mobilePhoneNumberInputRef: object,
    phoneNumberInputRef: object,
  }),
};

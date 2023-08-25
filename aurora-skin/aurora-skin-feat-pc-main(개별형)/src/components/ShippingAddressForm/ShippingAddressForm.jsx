import { useState } from 'react';

import { string, shape, bool, object } from 'prop-types';

import { Checkbox, PhoneNumberInput, TextField } from '@shopby/react-components';
import { ParameterTypeError } from '@shopby/shared';

import { PHONE_CARRIER_NUMBERS_BY_STRING } from '../../constants/form';
import AddressForm from '../AddressForm';

const DEFAULT_CONTACT = {
  carrierNumber: '',
  firstSerial: '',
  secondSerial: '',
};

const ShippingAddressForm = ({
  refs: {
    addressNameRef,
    receiverNameRef,
    addressFormRef,
    mobilePhoneNumberInputRef,
    phoneNumberInputRef,
    willBeSavedAsDefaultAddressRef,
  },
  className = '',
  addressName: initialAddressName = '',
  receiverName: initialReceiverName = '',
  zipCode: initialZipCode = '',
  roadAddress: initialRoadAddress = '',
  jibunAddress: initialJibunAddress = '',
  addressDetail: initialAddressDetail = '',
  willBeSavedAsDefaultAddress: initialWillBeSavedAsDefaultAddress = false,
  mobileNumber: initialMobileNumber = {
    ...DEFAULT_CONTACT,
  },
  phoneNumber: initialPhoneNumber = {
    ...DEFAULT_CONTACT,
  },
  children,
}) => {
  const [addressName, setAddressName] = useState(initialAddressName);
  const [receiverName, setReceiverName] = useState(initialReceiverName);
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [roadAddress, setRoadAddress] = useState(initialRoadAddress);
  const [jibunAddress, setJibunAddress] = useState(initialJibunAddress);
  const [addressDetail, setAddressDetail] = useState(initialAddressDetail);
  const [willBeSavedAsDefaultAddress, setWillBeSavedAsDefaultAddress] = useState(initialWillBeSavedAsDefaultAddress);
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  const handleAddressNameChange = ({ currentTarget: { value } }) => {
    setAddressName(value);
  };

  const handleReceiverNameChange = ({ currentTarget: { value } }) => {
    setReceiverName(value);
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    setAddressDetail(addressDetail);
  };

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    setZipCode(zipCode);
    setRoadAddress(roadAddress);
    setJibunAddress(jibunAddress);
  };

  const handlePhoneSerialNumberChange = ({ currentTarget: { value } }, type, isMobile = false) => {
    if (!['FIRST', 'SECOND'].includes(type)) {
      ParameterTypeError.of({ parameterName: 'type', functionName: handlePhoneSerialNumberChange.name });
    }

    const typeByLowerCase = type.toLowerCase();
    const setFunction = isMobile ? setMobileNumber : setPhoneNumber;

    setFunction((prev) => ({
      ...prev,
      [`${typeByLowerCase}Serial`]: value,
    }));
  };

  const handleCarrierNumberSelect = ({ currentTarget: { value } }, isMobile = false) => {
    const setFunction = isMobile ? setMobileNumber : setPhoneNumber;

    setFunction((prev) => ({
      ...prev,
      carrierNumber: value,
    }));
  };

  const handleSaveAsDefaultBtnClick = ({ currentTarget: { checked } }) => {
    setWillBeSavedAsDefaultAddress(checked);
  };

  return (
    <div className={`shipping-address-form ${className}`}>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">배송지명</label>
        <TextField ref={addressNameRef} value={addressName} onChange={handleAddressNameChange} />
      </div>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">받는 사람</label>
        <TextField ref={receiverNameRef} value={receiverName} onChange={handleReceiverNameChange} />
      </div>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">주소</label>
        <AddressForm
          ref={addressFormRef}
          jibunAddress={jibunAddress}
          zipCode={zipCode}
          address={roadAddress}
          addressDetail={addressDetail}
          onAddressDetailChange={handleAddressDetailChange}
          onAddressItemClick={handleAddressItemClick}
        />
      </div>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">휴대폰 번호</label>
        <PhoneNumberInput
          ref={mobilePhoneNumberInputRef}
          carrierNumber={mobileNumber.carrierNumber}
          firstSerial={mobileNumber.firstSerial}
          secondSerial={mobileNumber.secondSerial}
          onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST', true)}
          onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND', true)}
          onCarrierNumberSelect={(e) => handleCarrierNumberSelect(e, true)}
        />
      </div>
      <div className="shipping-address-form__item">
        <label className="shipping-address-form__item--label">전화번호</label>
        <PhoneNumberInput
          ref={phoneNumberInputRef}
          carrierNumbersByString={PHONE_CARRIER_NUMBERS_BY_STRING}
          carrierNumber={phoneNumber.carrierNumber}
          firstSerial={phoneNumber.firstSerial}
          secondSerial={phoneNumber.secondSerial}
          onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST')}
          onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND')}
          onCarrierNumberSelect={handleCarrierNumberSelect}
        />
      </div>
      <div className="shipping-address-form__item">
        <Checkbox
          ref={willBeSavedAsDefaultAddressRef}
          label="기본 배송지로 저장"
          onChange={handleSaveAsDefaultBtnClick}
          checked={willBeSavedAsDefaultAddress}
        />
      </div>
      {children}
    </div>
  );
};

export default ShippingAddressForm;

ShippingAddressForm.displayName = 'ShippingAddressForm';

ShippingAddressForm.propTypes = {
  className: string,
  addressName: string,
  receiverName: string,
  zipCode: string,
  roadAddress: string,
  jibunAddress: string,
  addressDetail: string,
  willBeSavedAsDefaultAddress: bool,
  mobileNumber: shape({
    carrierNumber: string,
    firstSerial: string,
    secondSerial: string,
  }),
  phoneNumber: shape({
    carrierNumber: string,
    firstSerial: string,
    secondSerial: string,
  }),
  refs: shape({
    addressNameRef: object,
    receiverNameRef: object,
    addressFormRef: object,
    mobilePhoneNumberInputRef: object,
    phoneNumberInputRef: object,
    willBeSavedAsDefaultAddressRef: object,
  }),
  children: object,
};

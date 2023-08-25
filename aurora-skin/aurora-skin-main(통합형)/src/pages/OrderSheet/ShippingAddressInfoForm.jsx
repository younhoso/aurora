import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { shape, object } from 'prop-types';

import {
  Accordion,
  Checkbox,
  PhoneNumberInput,
  SelectBox,
  TextField,
  useAuthActionContext,
  useMyShippingAddressActionContext,
  useMyShippingAddressStateContext,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
} from '@shopby/react-components';
import { parsePhoneNumber, ParameterTypeError } from '@shopby/shared';

import AddressForm from '../../components/AddressForm';
import { PHONE_CARRIER_NUMBERS_BY_STRING } from '../../constants/form';

import useDeliveryMemoOptions from './useDeliveryMemoOptions';

const ShippingAddressInfoForm = ({ refs: { receiverNameInputRef, addressFormRef, mobilePhoneNumberInputRef } }) => {
  const { t } = useTranslation(['common', 'order']);
  const { options: DELIVERY_MEMO_OPTIONS } = useDeliveryMemoOptions();
  const [deliveryMemo, setDeliveryMemo] = useState('');
  const [customDeliveryMemo, setCustomDeliveryMemo] = useState('');
  const {
    ordererInfo: { ordererName, phoneNumber: ordererPhoneNumber },
    shippingAddressInfo: {
      addressNo,
      zipCode,
      roadAddress,
      receiverName,
      mobilePhoneNumber,
      phoneNumber,
      customsIdNumber,
      addressDetail,
    },
    willAddressBeSaved,
    willBeSavedAsDefaultAddress,
    hasInternationalShippingProduct,
  } = useOrderSheetStateContext();

  const {
    updateShippingAddressInfo,
    updateWillBeSavedAsDefaultAddress,
    resetShippingAddressInfo,
    updateWillAddressBeSaved,
  } = useOrderSheetActionContext();

  const { bookedAddresses } = useMyShippingAddressStateContext();
  const { isSignedIn: checkIsSignedIn } = useAuthActionContext();
  const { getShippingAddressByAddressNo } = useMyShippingAddressActionContext();
  const [isReceiverRadioChecked, setIsReceiverRadioChecked] = useState(false);
  const isSignedIn = useMemo(() => checkIsSignedIn(), []);

  const addressOptions = useMemo(
    () => [
      {
        label: '새로운 배송지',
        value: '0',
      },
      ...bookedAddresses.map(({ addressNo, addressName, receiverName }) => ({
        label: `${addressName ? `${addressName} | ` : ''}${receiverName}`,
        value: addressNo,
      })),
    ],
    [bookedAddresses]
  );

  const handleReceiverCheckboxChange = ({ currentTarget: { checked } }) => {
    if (checked) {
      updateShippingAddressInfo({
        receiverName: ordererName,
        mobilePhoneNumber: { ...ordererPhoneNumber },
        addressNo: 0,
      });
    }

    setIsReceiverRadioChecked(checked);
  };

  const handleAddressSelect = ({ currentTarget: { value } }) => {
    resetShippingAddressInfo();
    updateWillAddressBeSaved(false);
    updateWillBeSavedAsDefaultAddress(false);

    if (value === '0') return;
    const {
      addressNo,
      addressName,
      receiverName,
      receiverContact1,
      receiverContact2,
      receiverZipCd: zipCode,
      receiverDetailAddress: addressDetail,
      receiverAddress: roadAddress,
      receiverJibunAddress: jibunAddress,
      countryCd,
    } = getShippingAddressByAddressNo(Number(value));
    const mobilePhoneNumber = receiverContact1 && parsePhoneNumber(receiverContact1);
    const phoneNumber = receiverContact2 && parsePhoneNumber(receiverContact2);

    updateShippingAddressInfo({
      addressNo,
      addressName,
      receiverName,
      zipCode,
      roadAddress,
      jibunAddress,
      addressDetail,
      countryCd,
    });

    if (mobilePhoneNumber) updateShippingAddressInfo({ mobilePhoneNumber });
    if (phoneNumber) updateShippingAddressInfo({ phoneNumber });
  };

  const handleReceiverNameChange = ({ currentTarget: { value } }) => {
    updateShippingAddressInfo({ addressNo: 0, receiverName: value });
  };

  const handlePhoneSerialNumberChange = ({ currentTarget: { value } }, type, isMobile = false) => {
    if (!['FIRST', 'SECOND'].includes(type)) {
      ParameterTypeError.of({ parameterName: 'type', functionName: handlePhoneSerialNumberChange.name });
    }

    const typeByLowerCase = type.toLowerCase();
    updateShippingAddressInfo({
      addressNo: 0,
      [isMobile ? 'mobilePhoneNumber' : 'phoneNumber']: {
        ...(isMobile ? mobilePhoneNumber : phoneNumber),
        [`${typeByLowerCase}Serial`]: value,
      },
    });
  };

  const handleCarrierNumberSelect = ({ currentTarget: { value } }, isMobile = false) => {
    updateShippingAddressInfo({
      addressNo: 0,
      [isMobile ? 'mobilePhoneNumber' : 'phoneNumber']: {
        ...(isMobile ? mobilePhoneNumber : phoneNumber),
        carrierNumber: value,
      },
    });
  };

  const handleDeliveryMemoSelect = ({ currentTarget: { value } }) => {
    if (deliveryMemo === 'DIRECT_INPUT') {
      setCustomDeliveryMemo('');
    }

    setDeliveryMemo(value);
    updateShippingAddressInfo({ deliveryMemo: value });
  };

  const handleCustomDeliveryMemoChange = ({ currentTarget: { value } }) => {
    if (deliveryMemo !== 'DIRECT_INPUT') return;

    setCustomDeliveryMemo(value);
    updateShippingAddressInfo({ deliveryMemo: value });
  };

  const handleSaveAsDefaultAddressBtnClick = ({ currentTarget: { checked } }) => {
    updateWillBeSavedAsDefaultAddress(checked);
    updateWillAddressBeSaved(checked);
  };

  const handleSaveAddressBtnClick = ({ currentTarget: { checked } }) => {
    updateWillAddressBeSaved(checked);

    if (willBeSavedAsDefaultAddress) {
      updateWillBeSavedAsDefaultAddress(false);
    }
  };

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    updateShippingAddressInfo({
      addressNo: 0,
      zipCode,
      roadAddress,
      jibunAddress,
    });
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    updateShippingAddressInfo({
      addressDetail,
    });
  };

  const handleCustomsIdNumberChange = ({ currentTarget: { value } }) => {
    updateShippingAddressInfo({ customsIdNumber: value });
  };

  return (
    <section className="l-panel">
      <Accordion title={t('shippingAddressInfo', { ns: 'order' })} isOpen={true}>
        <div className="order-sheet__item">
          <SelectBox value={addressNo} options={addressOptions} onSelect={handleAddressSelect} />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('receiverName', { ns: 'order' })}</label>
          <TextField ref={receiverNameInputRef} value={receiverName} onChange={handleReceiverNameChange} />
          <Checkbox
            label={t('isTheSameAsOrderer', { ns: 'order' })}
            onChange={handleReceiverCheckboxChange}
            checked={isReceiverRadioChecked}
          />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('address')}</label>
          <AddressForm
            ref={addressFormRef}
            zipCode={zipCode}
            address={roadAddress}
            addressDetail={addressDetail}
            onAddressDetailChange={handleAddressDetailChange}
            onAddressItemClick={handleAddressItemClick}
          />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('mobilePhoneNumber')}</label>
          <PhoneNumberInput
            ref={mobilePhoneNumberInputRef}
            carrierNumber={mobilePhoneNumber?.carrierNumber}
            firstSerial={mobilePhoneNumber?.firstSerial}
            secondSerial={mobilePhoneNumber?.secondSerial}
            onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST', true)}
            onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND', true)}
            onCarrierNumberSelect={(e) => handleCarrierNumberSelect(e, true)}
          />
        </div>
        <div className="order-sheet__item">
          <label className="order-sheet__item-subject">{t('phoneNumber')}</label>
          <PhoneNumberInput
            carrierNumbersByString={PHONE_CARRIER_NUMBERS_BY_STRING}
            carrierNumber={phoneNumber?.carrierNumber}
            firstSerial={phoneNumber?.firstSerial}
            secondSerial={phoneNumber?.secondSerial}
            onFirstSerialChange={(e) => handlePhoneSerialNumberChange(e, 'FIRST')}
            onSecondSerialChange={(e) => handlePhoneSerialNumberChange(e, 'SECOND')}
            onCarrierNumberSelect={handleCarrierNumberSelect}
          />
        </div>
        <div className="order-sheet__item">
          <SelectBox value={deliveryMemo} options={DELIVERY_MEMO_OPTIONS} onSelect={handleDeliveryMemoSelect} />
          {deliveryMemo === 'DIRECT_INPUT' && (
            <TextField
              className="order-sheet__custom-memo"
              value={customDeliveryMemo}
              onChange={handleCustomDeliveryMemoChange}
              maxLength={30}
              placeholder={t('Please input your requests for delivery.', { ns: 'order' })}
            />
          )}
        </div>
        {hasInternationalShippingProduct && (
          <div className="order-sheet__item">
            <label className="order-sheet__item-subject" htmlFor="customs-id-input">
              개인통관고유부호
            </label>
            <TextField
              id={'customs-id-input'}
              value={customsIdNumber}
              onChange={handleCustomsIdNumberChange}
              maxLength={13}
              valid="ENGLISH_NUMBER"
              placeholder="P로 시작하는 13자리"
            />
            <span className="order-sheet__customs-id-issuance">
              개인통관고유부호 발급&nbsp;
              <a
                alt="link-for-customs-id-issuance"
                href="https://unipass.customs.go.kr/csp/persIndex.do"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 &gt;
              </a>
            </span>
          </div>
        )}
        {isSignedIn && (
          <div className="order-sheet__item">
            <p>
              <Checkbox
                label={t('save as default shipping address', { ns: 'order' })}
                onChange={handleSaveAsDefaultAddressBtnClick}
                checked={willBeSavedAsDefaultAddress}
              />
            </p>
            {addressNo === 0 && (
              <p>
                <Checkbox
                  label={'배송지 관리 목록에 추가'}
                  onChange={handleSaveAddressBtnClick}
                  checked={willAddressBeSaved}
                />
              </p>
            )}
          </div>
        )}
      </Accordion>
    </section>
  );
};

ShippingAddressInfoForm.propTypes = {
  refs: shape({
    receiverNameInputRef: object,
    searchAddressBtnRef: object,
    mobilePhoneNumberInputRef: object,
    addressDetailInputRef: object,
  }),
};

export default ShippingAddressInfoForm;

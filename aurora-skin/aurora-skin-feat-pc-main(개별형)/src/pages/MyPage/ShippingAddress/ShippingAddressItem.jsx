import { useState, useMemo } from 'react';

import { string, number, shape, object, oneOf, func } from 'prop-types';

import {
  Button,
  VisibleComponent,
  useModalActionContext,
  useMyShippingAddressActionContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import ShippingAddressForm from '../../../components/ShippingAddressForm';

const ShippingAddressItem = ({
  refs,
  addressNo,
  addressName,
  receiverName,
  receiverZipCd,
  receiverAddress,
  receiverDetailAddress,
  receiverJibunAddress,
  receiverContact1,
  receiverContact2,
  defaultYn,
  getCheckMessageToSubmitForm,
  ...restDetail
}) => {
  const { fetchMyShippingAddress, modifyMyShippingAddress, deleteMyShippingAddress } =
    useMyShippingAddressActionContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const [isOpen, setIsOpen] = useState(false);
  const [mobileCarrierNumber = '', mobileFirstSerial = '', mobileSecondSerial = ''] = useMemo(
    () => receiverContact1.split('-'),
    [receiverContact1]
  );
  const [phoneCarrierNumber = '', phoneFirstSerial = '', phoneSecondSerial = ''] = useMemo(
    () => receiverContact2.split('-'),
    [receiverContact2]
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleShippingAddressFormModify = async () => {
    const {
      addressNameRef: {
        current: { value: addressName },
      },
      receiverNameRef: {
        current: { value: receiverName },
      },
      addressFormRef: {
        current: {
          addressForm: { zipCode, jibunAddress, address, addressDetail },
        },
      },
      mobilePhoneNumberInputRef: { current: mobilePhoneNumberInput },
      phoneNumberInputRef: { current: phoneNumberInput },
      willBeSavedAsDefaultAddressRef: {
        current: { checked: willBeSavedAsDefaultAddress },
      },
    } = refs;

    const form = {
      ...restDetail,
      addressNo,
      addressName,
      willBeSavedAsDefaultAddress,
      receiverName,
      receiverZipCd: zipCode,
      receiverJibunAddress: jibunAddress,
      receiverAddress: address,
      receiverDetailAddress: addressDetail,
      receiverContact1: mobilePhoneNumberInput.getValue(),
      receiverContact2: phoneNumberInput.getValue(),
    };

    const message = getCheckMessageToSubmitForm(form);

    if (message) {
      openAlert({
        message,
      });

      return;
    }

    try {
      await modifyMyShippingAddress(form);

      openAlert({
        message: '배송지 정보가 수정되었습니다.',
        onClose: async () => {
          await fetchMyShippingAddress();

          closeModal();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleShippingAddressDelete = () => {
    openConfirm({
      message: '배송지를 삭제하시겠습니까?',
      confirmLabel: '확인',
      onConfirm: async () => {
        try {
          await deleteMyShippingAddress({
            addressNo,
          });

          await fetchMyShippingAddress();
        } catch (e) {
          catchError(e);
        }
      },
    });
  };

  return (
    <>
      <li key={addressNo} className="profile-shipping-address__list-item">
        <p className="profile-shipping-address__name">{addressName}</p>
        <p className="profile-shipping-address__receiver">{receiverName}</p>
        <p className="profile-shipping-address__zip-code">{receiverZipCd}</p>
        <p className="profile-shipping-address__base-address">{receiverAddress}</p>
        <p className="profile-shipping-address__detail-address">{receiverDetailAddress}</p>
        <p className="profile-shipping-address__mobile">{receiverContact1 ?? receiverContact2}</p>
        <VisibleComponent
          shows={defaultYn === 'Y'}
          TruthyComponent={<p className="profile-shipping-address__default-address">기본 배송지</p>}
        />
        <div className="profile-shipping-address__buttons--sm">
          <Button label="수정" onClick={() => setIsOpen(true)} />
          <Button label="삭제" onClick={() => handleShippingAddressDelete()} />
        </div>
      </li>
      <VisibleComponent
        shows={isOpen}
        TruthyComponent={
          <FullModal title="배송지 수정" onClose={() => setIsOpen(false)}>
            <ShippingAddressForm
              refs={refs}
              onClose={() => setIsOpen(false)}
              className="profile-shipping-address__form"
              addressName={addressName}
              receiverName={receiverName}
              zipCode={receiverZipCd}
              roadAddress={receiverAddress}
              jibunAddress={receiverJibunAddress}
              addressDetail={receiverDetailAddress}
              willBeSavedAsDefaultAddress={defaultYn === 'Y'}
              mobileNumber={{
                carrierNumber: mobileCarrierNumber,
                firstSerial: mobileFirstSerial,
                secondSerial: mobileSecondSerial,
              }}
              phoneNumber={{
                carrierNumber: phoneCarrierNumber,
                firstSerial: phoneFirstSerial,
                secondSerial: phoneSecondSerial,
              }}
            >
              <div className="shipping-address-form__buttons">
                <Button theme="dark" label="취소" onClick={closeModal} />
                <Button theme="caution" label="수정" onClick={handleShippingAddressFormModify} />
              </div>
            </ShippingAddressForm>
          </FullModal>
        }
      />
    </>
  );
};

export default ShippingAddressItem;

ShippingAddressItem.propTypes = {
  addressNo: number,
  addressName: string,
  receiverName: string,
  receiverZipCd: string,
  receiverAddress: string,
  receiverJibunAddress: string,
  receiverDetailAddress: string,
  receiverContact1: string,
  receiverContact2: string,
  defaultYn: oneOf(['Y', 'N']),
  refs: shape({
    addressNameRef: object,
    receiverNameRef: object,
    addressFormRef: object,
    mobilePhoneNumberInputRef: object,
    phoneNumberInputRef: object,
  }),
  getCheckMessageToSubmitForm: func,
};

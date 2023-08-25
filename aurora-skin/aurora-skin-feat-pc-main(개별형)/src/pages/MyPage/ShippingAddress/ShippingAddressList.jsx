import { useEffect, useState, useRef } from 'react';

import {
  Button,
  VisibleComponent,
  useModalActionContext,
  useMyShippingAddressActionContext,
  useMyShippingAddressStateContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import ShippingAddressForm from '../../../components/ShippingAddressForm';

import ShippingAddressItem from './ShippingAddressItem';

// eslint-disable-next-line complexity
const getCheckMessageToSubmitForm = (reviewForm) => {
  if (!reviewForm.receiverName) {
    return '받는사람을 입력해주세요.';
  }

  if (!reviewForm.receiverZipCd || !reviewForm.receiverAddress || !reviewForm.receiverDetailAddress) {
    return '주소를 입력해주세요.';
  }

  const mobileNumber = reviewForm.receiverContact1?.replaceAll('-', '');

  if (mobileNumber.length === 0) {
    return '휴대폰번호를 입력해주세요.';
  }

  if (mobileNumber.length < 11) {
    return '정확한 휴대폰번호를 입력해주세요.';
  }

  return '';
};

const EmptyShippingAddressList = () => (
  <div className="empty-list">
    <p>배송지를 등록해주세요.</p>
  </div>
);

const ShippingAddressList = () => {
  const { fetchMyShippingAddress, saveMyShippingAddress } = useMyShippingAddressActionContext();
  const { bookedAddresses } = useMyShippingAddressStateContext();
  const { openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const refs = {
    addressNameRef: useRef(),
    receiverNameRef: useRef(),
    addressFormRef: useRef(),
    mobilePhoneNumberInputRef: useRef(),
    phoneNumberInputRef: useRef(),
    willBeSavedAsDefaultAddressRef: useRef(),
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleShippingAddressFormSubmit = async () => {
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
      addressType: 'BOOK',
      customsIdNumber: '',
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
      await saveMyShippingAddress(form);

      openAlert({
        message: '배송지 정보가 추가되었습니다.',
        onClose: async () => {
          await fetchMyShippingAddress();

          closeModal(false);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      await fetchMyShippingAddress();

      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <Button
        className="profile-shipping-address__registration-button"
        label="배송지 등록하기"
        onClick={() => setIsOpen(true)}
      />
      <VisibleComponent
        shows={!isLoading && !bookedAddresses.length}
        TruthyComponent={<EmptyShippingAddressList />}
        FalsyComponent={
          <>
            <ul className="profile-shipping-address__list">
              {bookedAddresses.map((bookedAddress) => (
                <ShippingAddressItem
                  key={bookedAddress.addressNo}
                  {...bookedAddress}
                  refs={refs}
                  getCheckMessageToSubmitForm={getCheckMessageToSubmitForm}
                />
              ))}
            </ul>
            <ListSkeleton isLoading={isLoading} />
          </>
        }
      />
      <VisibleComponent
        shows={isOpen}
        TruthyComponent={
          <FullModal id="profile-shipping-address__form" title="배송지 등록" onClose={() => setIsOpen(false)}>
            <ShippingAddressForm refs={refs} className="profile-shipping-address__form">
              <div className="shipping-address-form__buttons">
                <Button theme="dark" label="취소" onClick={closeModal} />
                <Button theme="caution" label="등록" onClick={handleShippingAddressFormSubmit} />
              </div>
            </ShippingAddressForm>
          </FullModal>
        }
      />
    </>
  );
};

export default ShippingAddressList;

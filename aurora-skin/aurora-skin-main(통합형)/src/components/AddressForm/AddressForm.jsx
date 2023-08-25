import { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { func, string } from 'prop-types';

import { Button, TextField } from '@shopby/react-components';

import FullModal from '../FullModal';
import SearchZipCodeForm from '../SearchZipCodeForm/SearchZipCodeForm';

const AddressForm = forwardRef(
  ({ zipCode, address, onAddressItemClick, addressDetail, onAddressDetailChange, jibunAddress }, ref) => {
    const { t } = useTranslation('common');
    const buttonRef = useRef();
    const detailAddressInputRef = useRef();
    const [isSearchFullModalOpen, setIsSearchFullModalOpen] = useState(false);

    const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
      onAddressItemClick?.({ zipCode, roadAddress, jibunAddress });
      setIsSearchFullModalOpen(false);
    };

    const handleAddressDetailChange = (e) => {
      const { value } = e.currentTarget;
      onAddressDetailChange?.({ addressDetail: value });
    };

    useImperativeHandle(ref, () => ({
      get addressForm() {
        return {
          zipCode,
          address,
          addressDetail,
          jibunAddress,
        };
      },
      focusSearchButton() {
        buttonRef.current.focus();
      },
      focusDetailAddressInput() {
        detailAddressInputRef.current.focus();
      },
    }));

    return (
      <form className="address-form">
        <p className="address-form__zip-code">
          <TextField value={zipCode} readOnly />
          <Button ref={buttonRef} label={t('searchAddress')} onClick={() => setIsSearchFullModalOpen(true)} />
        </p>
        <TextField value={address} readOnly />
        <TextField ref={detailAddressInputRef} value={addressDetail} onChange={handleAddressDetailChange} />
        {isSearchFullModalOpen && (
          <FullModal id="search-zip" title={t('searchAddress')} onClose={() => setIsSearchFullModalOpen(false)}>
            <SearchZipCodeForm onAddressItemClick={handleAddressItemClick} />
          </FullModal>
        )}
      </form>
    );
  }
);

export default AddressForm;

AddressForm.propTypes = {
  onAddressItemClick: func,
  zipCode: string,
  address: string,
  addressDetail: string,
  jibunAddress: string,
  onAddressDetailChange: func,
};

AddressForm.displayName = 'AddressForm';

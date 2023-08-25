import { useMemberModificationStateContext, useMemberModificationActionContext } from '@shopby/react-components';

import AddressForm from '../../components/AddressForm';

const MemberModificationAddressForm = () => {
  const { updateMemberModificationInfo } = useMemberModificationActionContext();

  const {
    memberModificationInfo: { zipCd: zipCode, address: roadAddress, detailAddress: addressDetail },
  } = useMemberModificationStateContext();

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    updateMemberModificationInfo({
      zipCd: zipCode,
      address: roadAddress,
      jibunAddress,
    });
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    updateMemberModificationInfo({ detailAddress: addressDetail });
  };

  return (
    <div className="member-modification-form__item">
      <label htmlFor="address" className="member-modification-form__tit">
        주소찾기
      </label>
      <AddressForm
        zipCode={zipCode}
        address={roadAddress}
        addressDetail={addressDetail}
        onAddressItemClick={handleAddressItemClick}
        onAddressDetailChange={handleAddressDetailChange}
      />
    </div>
  );
};

export default MemberModificationAddressForm;

MemberModificationAddressForm.propTypes = {};

import { useState } from 'react';

import { string, bool, oneOf, func } from 'prop-types';

import {
  Checkbox,
  useMallStateContext,
  SelectBox,
  VisibleComponent,
  useProductInquiryStateContext,
  CharacterCounter,
} from '@shopby/react-components';

import BoardNoticeList from '../BoardNoticeList/BoardNoticeList';
import BoardProductItem from '../BoardProductItem';

const ProductInquiryForm = ({
  productName,
  productImageUrl,
  title = '',
  content = '',
  type = 'PRODUCT',
  isSecreted = false,
  ButtonGroup,
}) => {
  const [productInquiryTitle, setProductInquiryTitle] = useState(title);
  const [productInquiryContent, setProductInquiryContent] = useState(content);
  const [isSecret, setIsSecret] = useState(isSecreted);
  const [currentType, setCurrentType] = useState(type);

  const { productInquiryTypes: types } = useMallStateContext();
  const { inquiryConfig } = useProductInquiryStateContext();

  const handleInquiryTypeSelect = ({ currentTarget }) => {
    setCurrentType(currentTarget.value);
  };

  const handleTitleChange = ({ character }) => {
    setProductInquiryTitle(character.value);
  };

  const handleTextChange = ({ character }) => {
    setProductInquiryContent(character.value);
  };

  const handleIsSecretChange = ({ currentTarget }) => {
    setIsSecret(currentTarget.checked);
  };

  return (
    <div className="board-form product-inquiry-form">
      <BoardProductItem productName={productName} productImageUrl={productImageUrl} />
      <div className="l-panel product-inquiry-form__content">
        <SelectBox
          className="product-inquiry-form__type"
          value={currentType}
          options={types ?? []}
          onSelect={handleInquiryTypeSelect}
        />
        <CharacterCounter
          id="product-inquiry-form__title"
          placeholder="제목을 작성해주세요."
          className="product-inquiry-form__title"
          onChange={handleTitleChange}
          value={productInquiryTitle}
          valid="NO_COMMON_SPECIAL"
          limitCount={{
            character: 50,
          }}
        />
        <CharacterCounter
          id="product-inquiry-form__text"
          counterType="CHARACTER"
          textType="TEXT_AREA"
          placeholder="내용을 작성해주세요."
          className="product-inquiry-form__text"
          onChange={handleTextChange}
          value={productInquiryContent}
          cols="30"
          rows="10"
          valid="NO_COMMON_SPECIAL"
          limitCount={{
            character: 1000,
          }}
        />
        <VisibleComponent
          shows={inquiryConfig.secretUsable}
          TruthyComponent={
            <div className="product-inquiry-form__secret">
              <Checkbox label="비밀글 설정" onChange={handleIsSecretChange} checked={isSecret} />
            </div>
          }
        />
        <ButtonGroup
          type={currentType}
          title={productInquiryTitle}
          content={productInquiryContent}
          isSecreted={isSecret}
        />
      </div>
      <BoardNoticeList
        texts={['성격에 맞지 않는 글, 비방성글, 음란글, 욕설 등은 통보 없이 이동 또는 삭제 될 수 있습니다.']}
      />
    </div>
  );
};

ProductInquiryForm.propTypes = {
  productName: string.isRequired,
  productImageUrl: string.isRequired,
  type: oneOf(['PRODUCT', 'DELIVERY', 'CANCEL', 'RETURN', 'EXCHANGE', 'REFUND', 'OTHER']),
  title: string,
  content: string,
  isSecreted: bool,
  ButtonGroup: func,
};

export default ProductInquiryForm;

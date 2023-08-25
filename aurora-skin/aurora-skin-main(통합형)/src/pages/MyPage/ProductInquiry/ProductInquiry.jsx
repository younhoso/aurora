import {
  ProductInquiryFormProvider,
  ProductInquiryProvider,
  ProfileProductInquiryProvider,
} from '@shopby/react-components';

import useLayoutChanger from '../../../hooks/useLayoutChanger';

import ProductInquiryContent from './ProductInquiryContent';

const ProductInquiry = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '상품문의 관리',
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <ProfileProductInquiryProvider>
      <ProductInquiryProvider>
        <ProductInquiryFormProvider>
          <ProductInquiryContent />
        </ProductInquiryFormProvider>
      </ProductInquiryProvider>
    </ProfileProductInquiryProvider>
  );
};

export default ProductInquiry;

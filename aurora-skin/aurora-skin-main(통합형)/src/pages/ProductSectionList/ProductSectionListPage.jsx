import { useOutletContext } from 'react-router-dom';

import { ProductSectionListProvider } from '@shopby/react-components';

import ProductSectionListWrap from './ProductSectionListWrap';

export const ProductSectionListPage = () => {
  const platformType = useOutletContext();

  return (
    <ProductSectionListProvider platformType={platformType}>
      <ProductSectionListWrap />
    </ProductSectionListProvider>
  );
};

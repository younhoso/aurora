import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  InfiniteScrollLoader,
  ProductInquiryFormProvider,
  VisibleComponent,
  useInfiniteScroll,
  useProductDetailStateContext,
  useProductInquiryActionContext,
  useProductInquiryStateContext,
} from '@shopby/react-components';

import ProductInquiryList from '../../../components/ProductInquiryList';

import Summary from './Summary';

const Inquiry = () => {
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));

  const {
    productDetail: { productName, images: productImages },
  } = useProductDetailStateContext();

  const { totalCount } = useProductInquiryStateContext();

  const { searchInquiries } = useProductInquiryActionContext();

  const mainImageUrl = useMemo(() => productImages.at(0)?.src ?? '', [productImages]);

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (param) => {
      const { data } = await searchInquiries(param);

      return data.inquiries;
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  const resetProductInquiries = () => {
    fetchInitialItems();
  };

  useEffect(() => {
    fetchInitialItems();
  }, []);

  return (
    <div className="product-content-inquiry">
      <ProductInquiryFormProvider>
        <Summary onSubmit={resetProductInquiries} />
        <ProductInquiryList
          productName={productName}
          mainImageUrl={mainImageUrl}
          productNo={productNo}
          totalCount={totalCount}
          onModify={resetProductInquiries}
          onDelete={resetProductInquiries}
          inquiries={accumulativeItems}
          isLoading={isLoading}
        />
        <VisibleComponent
          shows={accumulativeItems.length > 0}
          TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
        />
      </ProductInquiryFormProvider>
    </div>
  );
};

export default Inquiry;

Inquiry.propTypes = {
  isLoading: bool,
};

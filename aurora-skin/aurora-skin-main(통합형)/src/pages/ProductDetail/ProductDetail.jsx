import { useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useSearchParams } from 'react-router-dom';

import {
  TabsProvider,
  useProductDetailStateContext,
  ProductReviewProvider,
  useProductReviewStateContext,
  useTabsActiveContext,
  ProductInquiryProvider,
  useProductInquiryStateContext,
  ProductOptionProvider,
  CouponByProductProvider,
  CartProvider,
  OrderSheetProvider,
  useProductInquiryActionContext,
  useProductDetailActionContext,
  useProductOptionActionContext,
  usePageScriptsActionContext,
  NaverPayProvider,
  useMallStateContext,
} from '@shopby/react-components';

import AdminBanner from '../../components/AdminBanner';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import Content from './Content';
import ImageSlider from './ImageSlider';
import Purchase from './Purchase';
import RelatedProduct from './RelatedProduct';
import Summary from './Summary';

const makeTabs = ({ reviewCount = 0, inquiryCount = 0, hasGuide = false } = {}) => {
  const tabs = [
    {
      value: 'DETAIL',
      label: '상품 상세정보',
    },
    {
      value: 'REVIEW',
      label: `상품후기 (${reviewCount})`,
    },
    {
      value: 'INQUIRY',
      label: `상품 Q&A (${inquiryCount})`,
    },
  ];

  if (hasGuide) {
    tabs.push({
      value: 'SHIPPING_CLAIM',
      label: '배송/교환/반품',
    });
  }

  return tabs;
};

const ProductDetailContent = () => {
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const {
    productDetail: { productName, guide },
    originProductDetail,
  } = useProductDetailStateContext();

  const { applyPageScripts } = usePageScriptsActionContext();
  const { fetchProductDetail, fetchRelatedProducts } = useProductDetailActionContext();
  const { fetchSelectorOptions } = useProductOptionActionContext();
  const { updateTabs } = useTabsActiveContext();
  const { totalCount: reviewCount } = useProductReviewStateContext();
  const { totalCount: inquiryCount } = useProductInquiryStateContext();
  const { searchInquiries } = useProductInquiryActionContext();
  const { relatedProducts } = useProductDetailStateContext();

  useLayoutChanger({ hasBackBtnOnHeader: true, title: productName });

  useEffect(() => {
    if (!originProductDetail) return;

    applyPageScripts('PRODUCT', { product: originProductDetail });
  }, [originProductDetail]);

  useEffect(() => {
    searchInquiries();

    if (productNo > 0) {
      fetchProductDetail({
        productNo,
        channelType,
      });

      fetchRelatedProducts({
        productNo,
      });

      fetchSelectorOptions({
        productNo,
      });
    }
  }, [productNo]);

  const hasGuide = useMemo(() => Object.entries(guide).some(([, content]) => Boolean(content)), [guide]);

  useEffect(
    () =>
      updateTabs(
        makeTabs({
          reviewCount,
          inquiryCount,
          hasGuide,
        })
      ),
    [reviewCount, inquiryCount, hasGuide]
  );

  return (
    <div className="product-detail">
      <ImageSlider />
      <Summary />
      {relatedProducts?.length > 0 && <RelatedProduct />}
      <AdminBanner bannerId="BNDETAIL" />
      <Content />
    </div>
  );
};

const ProductDetail = () => {
  const { clientId, mallProfile } = useMallStateContext();
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));

  const initialTabs = useMemo(() => makeTabs(), []);

  return (
    <ProductReviewProvider productNo={productNo}>
      <ProductInquiryProvider productNo={productNo}>
        <TabsProvider
          initialState={{
            currentTab: 'DETAIL',
            tabs: initialTabs,
          }}
        >
          <OrderSheetProvider>
            <NaverPayProvider clientId={clientId} mallProfile={mallProfile} platform={isMobile ? 'MOBILE_WEB' : 'PC'}>
              <CartProvider>
                <ProductOptionProvider productNo={productNo}>
                  <CouponByProductProvider productNo={productNo}>
                    <ProductDetailContent />
                  </CouponByProductProvider>
                  <Purchase />
                </ProductOptionProvider>
              </CartProvider>
            </NaverPayProvider>
          </OrderSheetProvider>
        </TabsProvider>
      </ProductInquiryProvider>
    </ProductReviewProvider>
  );
};

export default ProductDetail;

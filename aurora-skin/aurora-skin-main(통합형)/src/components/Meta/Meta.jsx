import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet';

import { useBannerStateContext, useMallStateContext, useProductDetailStateContext } from '@shopby/react-components';
import { PLATFORM_TYPE } from '@shopby/shared';

import { META_TAG_KEY } from '../../constants/common';
import useExternalServiceConfig from '../../hooks/useExternalServiceConfig';

const scheme = `${location.origin.split('://').at(0)}`;
const addScheme = (url) => (url ? `${scheme}:${url}` : '');

const metaTagCreatorMap = {
  [META_TAG_KEY.PRODUCT]: ({ productNo, productName, imageUrls, url }) => ({
    type: 'product',
    title: productName,
    image: addScheme(imageUrls?.at(0)),
    url: `${url}/product-detail?productNo=${productNo}`,
  }),
  [META_TAG_KEY.COMMON]: ({ mallName, bannerMap, url }) => {
    const banner = bannerMap.get('LOGO') ?? {};

    return {
      type: 'website',
      title: mallName,
      image: addScheme(banner?.banners?.[0].bannerImages?.[0].imageUrl),
      url,
    };
  },
};

const createMetaTagBy = ({ product, mallName, url, bannerMap } = {}) => {
  const isProductDetailPage = window.location.href.includes('product-detail') || product?.productName;
  const metaTagKey = isProductDetailPage ? META_TAG_KEY.PRODUCT : META_TAG_KEY.COMMON;

  return metaTagCreatorMap[metaTagKey]({
    ...product,
    mallName,
    bannerMap,
    url,
  });
};

const Meta = () => {
  const { mallName, mall, externalServiceConfig } = useMallStateContext();
  const { productDetail } = useProductDetailStateContext();
  const { bannerMap } = useBannerStateContext();
  const { setExternalService } = useExternalServiceConfig();
  const platform = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;
  const mallUrl = mall.url?.[platform.toLocaleLowerCase()];

  const { type, title, image, url } = createMetaTagBy({
    product: productDetail?.baseInfo,
    bannerMap,
    mallName,
    url: mallUrl,
  });

  useEffect(() => {
    setExternalService(externalServiceConfig);
  }, [location.pathname, externalServiceConfig]);

  if (!image) return <></>;

  return (
    <Helmet>
      <meta name="author" content={mallName} />
      <meta name="description" content={mallName} />
      <meta name="keywords" content={mallName} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content="여기를 눌러 링크를 확인하세요." />
      <meta property="og:image:width" content="436" />
      <meta property="og:image:height" content="134" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content="여기를 눌러 링크를 확인하세요." />
      <meta name="twitter:image" content={image} />
      <title>{mallName}</title>
    </Helmet>
  );
};

export default Meta;

import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet';

import { useBannerStateContext, useMallStateContext } from '@shopby/react-components';
import { PLATFORM_TYPE } from '@shopby/shared';

const Meta = () => {
  const { mallName, mall } = useMallStateContext();
  const { bannerMap } = useBannerStateContext();
  const platform = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;
  const url = mall.url?.[platform.toLocaleLowerCase()];
  const banner = bannerMap.get('LOGO') ?? {};

  return (
    <Helmet>
      <meta name="author" content={mallName} />
      <meta name="description" content={mallName} />
      <meta name="keywords" content={mallName} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={mallName} />
      <meta property="og:image" content={banner?.banners?.[0].bannerImages?.[0].imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content="여기를 눌러 링크를 확인하세요." />
      <meta property="og:image:width" content="436" />
      <meta property="og:image:height" content="134" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={mallName} />
      <meta name="twitter:description" content="여기를 눌러 링크를 확인하세요." />
      <meta name="twitter:image" content={banner?.banners?.[0].bannerImages?.[0].imageUrl} />
      <title>{mallName}</title>
    </Helmet>
  );
};

export default Meta;

import { string } from 'prop-types';

import { useBannerStateContext, Skeleton } from '@shopby/react-components';

import HeroContents from './HeroContents';
import AdminBanner from '../../components/AdminBanner';

const Hero = ({ bannerId }) => {
  const { bannerMap, isLoading } = useBannerStateContext();
  const banner = bannerMap.get(bannerId);

  if (isLoading) return <Skeleton type="SQUARE" />;
  if (!banner) return <></>;

  const { imageSize, bannerGroupName } = banner;
  const [bannerInfo] = banner.banners;
  const { bannerImages, visible, slideBannerConfig } = bannerInfo;

  if (bannerImages.length === 1) {
    return <AdminBanner bannerId="BNSLIDE" className="banner-image full-width-img" />;
  }

  return visible || bannerImages.length ? (
    <HeroContents a11y={bannerGroupName} config={slideBannerConfig} bannerImages={bannerImages} imageSize={imageSize} />
  ) : (
    <></>
  );
};

Hero.propTypes = {
  bannerId: string,
};

export default Hero;

import { string, oneOf } from 'prop-types';

import { useBannerStateContext, Skeleton } from '@shopby/react-components';

import CustomBanner from '../CustomBanner';

const AdminBanner = ({ className, bannerId }) => {
  const { bannerMap, isLoading } = useBannerStateContext();

  if (isLoading) return <Skeleton type="SQUARE" />;

  const banner = bannerMap?.get(bannerId);
  const { banners, imageSize, bannerGroupName } = banner ?? {};

  if (!banners || !banners.length) return <></>;

  const [bannerInfo] = banners;
  const { bannerImages, visible } = bannerInfo;

  if (!visible) return <></>;

  return (
    <>
      {bannerImages?.map((image) => (
        <CustomBanner
          key={image.imageNo}
          className={className}
          href={image.landingUrl ?? ''}
          target={image.openLocationType === 'NEW' ? '_blank' : '_self'}
          src={image.imageUrl}
          alt={image.description || bannerGroupName}
          width={imageSize.width}
          height={imageSize.height}
        />
      ))}
    </>
  );
};

export default AdminBanner;

AdminBanner.propTypes = {
  className: string,
  bannerId: oneOf([
    'LOGO',
    'BNSLIDE',
    'BANNER01',
    'BANNER02',
    'BANNER03',
    'BANNER04',
    'BANNER05',
    'BNBOTTOM',
    'BNBGLEFT',
    'BNDETAIL',
  ]),
};

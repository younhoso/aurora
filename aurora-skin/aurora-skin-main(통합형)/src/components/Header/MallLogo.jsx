import { Link } from 'react-router-dom';

import { arrayOf, oneOf, number, string, bool, shape } from 'prop-types';

const MallLogo = ({ banner }) => {
  if (!banner) return <></>;

  const { imageSize, banners } = banner;
  const [bannerInfo] = banners;
  const { bannerImages } = bannerInfo;
  const [imageInfo] = bannerImages;

  return (
    <h1 className="header__title">
      <Link href={imageInfo.landingUrl} target={imageInfo.openLocationType === 'NEW' ? '_blank' : '_self'}>
        <img
          className="header__logo-img"
          src={imageInfo.imageUrl}
          alt={imageInfo.description || '(로고) 홈으로 가기'}
          loading="lazy"
          width={imageSize.width}
          height={imageSize.height}
        />
      </Link>
    </h1>
  );
};

export default MallLogo;

MallLogo.propTypes = {
  banner: shape({
    skinCode: string,
    skinName: string,
    bannerGroupType: string,
    skinNo: number,
    imageSize: shape({
      width: string,
      height: string,
    }),
    banners: arrayOf(
      shape({
        visible: bool,
        resizable: bool,
        registerDateTime: string,
        slideBannerConfig: shape({
          slideSpeedType: string,
          slideNavigationInfo: shape({
            buttonSizeType: string,
            inactiveButtonColor: string,
            activeButtonColor: string,
            buttonBorderType: string,
          }),
          slideButtonColor: string,
          slideTime: number,
          slideNavigationType: string,
          slideEffectType: string,
          usableSlideButton: bool,
        }),
        platformType: string,
        bannerNo: number,
        displayValue: shape({
          startDateTime: string,
          endDateTime: string,
          displayPeriodType: string,
        }),
        bannerTitle: string,
        width: number,
        updateDateTime: string,
        sizeUnitType: string,
        bannerImages: arrayOf(
          shape({
            displayValue: shape({
              startDateTime: string,
              endDateTime: string,
              displayPeriodType: string,
            }),
            openLocationType: string,
            inactiveNavigationImageUrl: string,
            imageUrl: string,
            displayOrder: number,
            description: string,
            imageNo: number,
            activeNavigationImageUrl: string,
            landingUrl: string,
          })
        ),
        height: number,
      })
    ),
    bannerGroupName: string,
    bannerGroupCode: oneOf([
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
  }),
};

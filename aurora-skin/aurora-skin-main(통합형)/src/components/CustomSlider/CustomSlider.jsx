import { oneOf, number, string, object, arrayOf, shape } from 'prop-types';

import { Slide, Slider } from '@shopby/react-components';

import CustomBanner from '../../components/CustomBanner';

const DefaultSliderOption = {
  effect: 'slide', // 'slide' | 'fade'
  navigation: false,
  pagination: false,
  autoplay: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  loop: true,
  fadeEffect: {
    crossFade: true,
  },
};

const CustomSlider = ({ a11y = '슬라이드', slideOption = {}, bannerImages = [], width = 'auto', height = 'auto' }) => {
  if (!bannerImages.length) return <></>;

  return (
    <>
      <h2 className="a11y">{a11y}</h2>
      <Slider {...DefaultSliderOption} {...slideOption}>
        {bannerImages.map(({ description, imageNo, imageUrl, landingUrl, openLocationType }) => (
          <Slide key={imageNo}>
            <CustomBanner
              href={landingUrl}
              target={openLocationType === 'NEW' ? '_blank' : '_self'}
              src={imageUrl}
              alt={description}
              width={width}
              height={height}
            />
          </Slide>
        ))}
        <div className="swiper-pagination"></div>
      </Slider>
    </>
  );
};

export default CustomSlider;

CustomSlider.propTypes = {
  a11y: string,
  slideOption: object,
  bannerImages: arrayOf(
    shape({
      description: string,
      imageNo: number,
      imageUrl: string,
      landingUrl: string,
      openLocationType: oneOf(['NEW', 'SELF']),
    })
  ),
  width: string,
  height: string,
};

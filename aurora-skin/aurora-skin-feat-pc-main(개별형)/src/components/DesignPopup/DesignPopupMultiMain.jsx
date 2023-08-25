import { number, string, bool, shape, oneOf, arrayOf } from 'prop-types';

import { Slide, Slider } from '@shopby/react-components';

import { SLIDE_DIRECTION_MAP } from '../../constants/designPopup';

const DesignPopupMultiMain = ({ slideMaxWidth, slideMaxHeight, slideDirection, slideSpeed, slideImages }) => {
  const mainUrls = slideImages.map(({ mainImageUrl, popupImageNo }) => ({
    mainImageUrl,
    popupImageNo: `main_${popupImageNo}`,
  }));

  const { effect, direction, reverseDirection } = SLIDE_DIRECTION_MAP[slideDirection];

  return (
    <div height={`${slideMaxHeight}px`}>
      <Slider
        autoHeight={true}
        effect={effect}
        direction={direction}
        autoplay={{
          delay: (slideSpeed ?? 1) * 1000 || 2500,
          reverseDirection,
        }}
        loop={true}
        slidesPerView="auto"
      >
        {mainUrls?.map((main) => (
          <Slide key={main.popupImageNo}>
            <img src={main.mainImageUrl} width={`${slideMaxWidth}px`} height={`${slideMaxHeight}px`} />
          </Slide>
        ))}
      </Slider>
    </div>
  );
};

export default DesignPopupMultiMain;

DesignPopupMultiMain.propTypes = {
  canResize: bool,
  slideSpeed: oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  slideMaxWidth: number,
  slideMaxHeight: number,
  slideDirection: oneOf(['FIXED', 'RIGHT', 'LEFT', 'UP', 'DOWN']),
  slideImages: arrayOf(
    shape({
      hasUploaded: bool,
      landingUrl: string,
      mainImageUrl: string,
      openLocationTarget: oneOf(['SELF', 'BLANK']),
      popupImageNo: number,
      thumbImageUrl: string,
      thumbImageUrlOnOver: string,
    })
  ),
};

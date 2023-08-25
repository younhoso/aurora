import { useMemo } from 'react';

import {
  Slider,
  Slide,
  ThumbItem,
  useProductDetailStateContext,
  Skeleton,
  VisibleComponent,
} from '@shopby/react-components';

const ImageSlider = () => {
  const {
    productDetail: { images },
  } = useProductDetailStateContext();

  const sliderConfig = useMemo(
    () => ({
      pagination: {
        clickable: true,
      },
      navigation: false,
      loop: false,
      slidesPerView: 'auto',
    }),
    [images]
  );

  return (
    <>
      <VisibleComponent
        shows={images.length > 0}
        TruthyComponent={
          <Slider className="product-image-slider" {...sliderConfig}>
            {images.map((imageInfo, idx) => (
              <Slide key={idx}>
                <ThumbItem {...imageInfo} />
              </Slide>
            ))}
          </Slider>
        }
        FalsyComponent={<Skeleton type="SQUARE" />}
      />
    </>
  );
};

export default ImageSlider;

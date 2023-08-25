import { useState } from 'react';

import { number, string, bool, shape, oneOf, arrayOf } from 'prop-types';

import { SLIDE_COUNT_MAP } from '../../constants/designPopup';

const SubjectItem = ({
  thumbImageUrl,
  thumbImageUrlOnOver,
  landingUrl,
  openLocationTarget,
  slideMinWidth,
  slideMinHeight,
}) => {
  const [imageUrl, setImageUrl] = useState(thumbImageUrl);

  const handleMouseEnter = () => {
    setImageUrl(thumbImageUrlOnOver);
  };

  const handleMouseLeave = () => {
    setImageUrl(thumbImageUrl);
  };

  return (
    <a href={landingUrl} target={`_${openLocationTarget?.toLowerCase()}`}>
      <img
        src={imageUrl}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
        width={`${slideMinWidth}px`}
        height={`${slideMinHeight}px`}
      />
    </a>
  );
};

SubjectItem.propTypes = {
  thumbImageUrl: string,
  thumbImageUrlOnOver: string,
  slideMinWidth: number,
  slideMinHeight: number,
  landingUrl: string,
  openLocationTarget: oneOf(['SELF', 'BLANK']),
};

const getGridInformation = (slideCount) => ({
  gridTemplateRows: `repeat(${SLIDE_COUNT_MAP[slideCount.split('_BY_').at(1)]}, 1fr)`,
  gridTemplateColumns: `repeat(${SLIDE_COUNT_MAP[slideCount.split('_BY_').at(0)]}, 1fr)`,
});

const DesignPopupMultiSubject = ({ slideImages, slideCount, slideMinWidth, slideMinHeight }) => {
  const thumbImageUrls = slideImages.map(({ thumbImageUrl, thumbImageUrlOnOver, popupImageNo, landingUrl }) => ({
    thumbImageUrl,
    thumbImageUrlOnOver,
    popupImageNo: `thumb_${popupImageNo}`,
    landingUrl,
  }));

  const { gridTemplateRows, gridTemplateColumns } = getGridInformation(slideCount);

  return (
    <div
      className="design-popup__thumb-image"
      style={{
        display: 'grid',
        gridTemplateRows,
        gridTemplateColumns,
      }}
    >
      {thumbImageUrls?.map((url) => (
        // console.log(url);

        <SubjectItem key={url.popupImageNo} {...url} slideMinWidth={slideMinWidth} slideMinHeight={slideMinHeight} />
      ))}
    </div>
  );
};

export default DesignPopupMultiSubject;

DesignPopupMultiSubject.propTypes = {
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
  slideCount: oneOf(['TWO_BY_ONE', 'THREE_BY_ONE', 'FOUR_BY_ONE', 'TWO_BY_TWO', 'THREE_BY_TWO', 'FOUR_BY_TWO']),
  slideMinWidth: number,
  slideMinHeight: number,
};

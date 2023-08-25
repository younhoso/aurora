import { number, string, bool, shape, oneOf, arrayOf, node } from 'prop-types';

import DesignPopupMultiMain from './DesignPopupMultiMain';
import DesignPopupMultiSubject from './DesignPopupMultiSubject';

const DesignPopupMulti = ({
  slideMinWidth,
  slideMinHeight,
  slideMaxWidth,
  slideMaxHeight,
  slideSpeed,
  slideImages,
  slideCount,
  slideDirection,
  children,
}) => (
  <div
    className="design-popup__content"
    style={{
      width: `${slideMaxWidth}px`,
    }}
  >
    <DesignPopupMultiMain
      slideImages={slideImages}
      slideMaxWidth={slideMaxWidth}
      slideMaxHeight={slideMaxHeight}
      slideDirection={slideDirection}
      slideSpeed={slideSpeed}
    />
    <DesignPopupMultiSubject
      slideImages={slideImages}
      slideCount={slideCount}
      slideMinWidth={slideMinWidth}
      slideMinHeight={slideMinHeight}
    />
    {children}
  </div>
);

export default DesignPopupMulti;

DesignPopupMulti.propTypes = {
  children: node,
  slideSpeed: oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  slideMinWidth: number,
  slideMinHeight: number,
  slideMaxWidth: number,
  slideMaxHeight: number,
  canResize: bool,
  slideCount: oneOf(['TWO_BY_ONE', 'THREE_BY_ONE', 'FOUR_BY_ONE', 'TWO_BY_TWO', 'THREE_BY_TWO', 'FOUR_BY_TWO']),
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

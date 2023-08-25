import { forwardRef, useEffect, useRef } from 'react';

import { string, oneOf, number, node } from 'prop-types';

const SIZE_CALCULATOR = {
  PERCENT: ({ screenWidth, screenHeight }) => {
    const width = (window.innerWidth * screenWidth) / 100;
    const height = (window.innerHeight * screenHeight) / 100;

    return {
      width,
      height,
    };
  },
  PIXEL: ({ screenWidth, screenHeight }) => ({
    width: screenWidth,
    height: screenHeight,
  }),
};

const DesignPopupNormal = forwardRef(
  ({ content, screenWidthUnit, screenHeightUnit, bgColor, screenWidth, screenHeight, children }, ref) => {
    const editorContentRef = useRef();

    const style = {
      background: bgColor,
      width: `${SIZE_CALCULATOR[screenWidthUnit]({ screenWidth, screenHeight }).width}px`,
      height: `${SIZE_CALCULATOR[screenHeightUnit]({ screenWidth, screenHeight }).height}px`,
    };

    useEffect(() => {
      const current = editorContentRef?.current;

      if (!current || current.children.length > 0) return;

      const fragment = document.createRange().createContextualFragment(content);

      current.replaceChildren(fragment);
    }, [editorContentRef?.current]);

    return (
      <div className="editor" ref={ref}>
        <div ref={editorContentRef} className="design-popup__content" style={style} />
        {children}
      </div>
    );
  }
);

export default DesignPopupNormal;

DesignPopupNormal.displayName = 'DesignPopupNormal';

DesignPopupNormal.propTypes = {
  className: string,
  content: string,
  screenWidthUnit: oneOf(['PERCENT', 'PIXEL']),
  screenHeightUnit: oneOf(['PERCENT', 'PIXEL']),
  bgColor: string,
  screenWidth: number,
  screenHeight: number,
  children: node,
};

import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { func, number, string, bool, shape, oneOf, arrayOf, object } from 'prop-types';

import {
  Button,
  VisibleComponent,
  useDesignPopupStateContext,
  useDesignPopupActionContext,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

import useDragAndDrop from '../../hooks/useDragAndDrop';
import { getPageTypeInformation } from '../../utils/design';

import DesignPopupMulti from './DesignPopupMulti';
import DesignPopupNormal from './DesignPopupNormal';

const popupHeightMap = new Map();

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

export const DesignPopupItem = ({
  className = '',
  isWindowPopup = false,
  onDeleteClick,
  onVisibleTodayClick,
  content,
  detailInfo,
  popupDesignType,
  popupNo,
  popupSlideInfo,
  usesVisibleTodayOption,
  isFixedTop,
  canDrag,
  refs = {},
}) => {
  const detailRef = useRef();

  const { position, handleDragStart, handleDrag, handleDragOver, handleDragEnd } = useDragAndDrop({
    initialLeft: detailInfo.screenLeftPosition,
    initialTop: detailInfo.screenTopPosition,
  });

  const style = useMemo(() => {
    if (!isFixedTop) return {};

    return {
      left: 0,
      top: 0,
      paddingLeft: detailInfo.screenLeftPosition,
      paddingTop: detailInfo.screenTopPosition,
      width: '100%',
      boxShadow: 'none',
      border: 'none',
      zIndex: 6,
    };
  }, [detailInfo]);

  const handleDeleteClick = (popupNo) => {
    onDeleteClick(popupNo);

    if (isFixedTop) {
      popupHeightMap['delete'](popupNo);
      const greatestHeight = [...popupHeightMap.values()]?.sort((a, b) => b - a)?.at(0) ?? 0;
      refs.pageInnerRef.current.style.marginTop = `${greatestHeight}px`;
    }

    if (isWindowPopup) {
      window.close();
    }
  };

  const handleVisibleTodayClick = (popupNo) => {
    onVisibleTodayClick(popupNo);

    handleDeleteClick(popupNo);
  };

  useEffect(() => {
    if (!detailRef?.current) return;
    if (!isFixedTop) return;

    popupHeightMap.set(popupNo, detailRef.current.clientHeight);

    const greatestHeight = [...popupHeightMap.values()]?.sort((a, b) => b - a)?.at(0) ?? 0;
    refs.pageInnerRef.current.style.marginTop = `${greatestHeight}px`;
  }, []);

  useEffect(() => {
    if (detailInfo.screenType === 'WINDOW' && !isWindowPopup) {
      const windowOption = {
        toolbar: 'no',
        status: 'no',
        statusbar: 'no',
        menubar: 'no',
        scrollbars: 'no',
        resizable: 'yes',
        location: 'yes',
        left: detailInfo.screenLeftPosition,
        top: detailInfo.screenTopPosition,
        width: SIZE_CALCULATOR[detailInfo.screenWidthUnit](detailInfo).width,
        height: SIZE_CALCULATOR[detailInfo.screenHeightUnit](detailInfo).height + 42,
      };

      const windowOptionStr = Object.entries(windowOption)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');

      window.name = '';

      window.open(
        `/design-popup?popupNo=${popupNo}&pathname=${encodeURIComponent(
          location.pathname
        )}&parameter=${encodeURIComponent(location.search)}`,
        `design-popup-${popupNo}`,
        windowOptionStr
      );
    }
  }, []);

  if (detailInfo.screenType === 'WINDOW' && !isWindowPopup) return <></>;

  return (
    <div
      ref={detailRef}
      draggable={canDrag}
      className={`design-popup ${className}`}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      style={{ ...position, ...style }}
    >
      <VisibleComponent
        key={popupNo}
        shows={popupDesignType === 'MULTI'}
        TruthyComponent={
          <DesignPopupMulti {...popupSlideInfo}>
            <div className="design-popup__btns">
              <VisibleComponent
                shows={usesVisibleTodayOption}
                TruthyComponent={
                  <Button label="오늘 하루 보이지 않음" onClick={() => handleVisibleTodayClick(popupNo)} />
                }
              />
              <Button className="design-popup__btn--close" label="닫기" onClick={() => handleDeleteClick(popupNo)} />
            </div>
          </DesignPopupMulti>
        }
        FalsyComponent={
          <DesignPopupNormal content={content} {...detailInfo}>
            <div className="design-popup__btns">
              <VisibleComponent
                shows={usesVisibleTodayOption}
                TruthyComponent={
                  <Button label="오늘 하루 보이지 않음" onClick={() => handleVisibleTodayClick(popupNo)} />
                }
              />
              <Button className="design-popup__btn--close" label="닫기" onClick={() => handleDeleteClick(popupNo)} />
            </div>
          </DesignPopupNormal>
        }
      />
    </div>
  );
};
DesignPopupItem.displayName = 'DesignPopupItem';

DesignPopupItem.propTypes = {
  className: string,
  onDeleteClick: func,
  onVisibleTodayClick: func,
  content: string,
  detailInfo: shape({
    bgColor: string,
    canResize: bool,
    screenHeight: number,
    screenHeightUnit: oneOf(['PIXEL', 'PERCENT']),
    screenLeftPosition: number,
    screenTopPosition: number,
    screenType: oneOf(['FIXED', 'FIXED_TOP', 'LAYER', 'WINDOW']),
    screenWidth: number,
    screenWidthUnit: oneOf(['PIXEL', 'PERCENT']),
  }),
  mallNo: number,
  popupDesignType: oneOf(['NORMAL', 'MULTI']),
  popupNo: number,
  popupSlideInfo: shape({
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
  }),
  title: string,
  usesVisibleTodayOption: bool,
  isFixedTop: bool,
  canDrag: bool,
  refs: shape({
    designPopupRef: object,
    pageRef: object,
    pageInnerRef: object,
  }),
  isWindowPopup: bool,
};

const DesignPopup = ({ refs }) => {
  const location = useLocation();
  const { designPopups, displayPopups } = useDesignPopupStateContext();
  const { fetchDesignPopups, fetchDisplayPopups, putVisibleTodayBy, deleteDesignPopupBy } =
    useDesignPopupActionContext();

  const popups = useMemo(() => [...designPopups, ...displayPopups], [designPopups, displayPopups]);

  useEffect(() => {
    const pageTypeInformation = getPageTypeInformation();
    pageTypeInformation &&
      fetchDisplayPopups({
        ...pageTypeInformation,
      });

    fetchDesignPopups({
      displayUrl: location.pathname,
      parameter: location.search,
    });
  }, [location, isSignedIn()]);

  if (!popups?.length) {
    if (refs?.pageInnerRef?.current) {
      refs.pageInnerRef.current.style.marginTop = `${0}px`;
    }

    return <></>;
  }

  return (
    <div>
      {popups.map((designPopup) => (
        <DesignPopupItem
          refs={refs}
          key={designPopup.popupNo}
          {...designPopup}
          isFixedTop={designPopup.detailInfo.screenType === 'FIXED_TOP'}
          canDrag={designPopup.detailInfo.screenType === 'LAYER'}
          onDeleteClick={(popupNo) => {
            deleteDesignPopupBy({
              popupNo,
            });
          }}
          onVisibleTodayClick={(popupNo) => {
            putVisibleTodayBy({
              popupNo,
              shouldHide: true,
            });
          }}
        />
      ))}
    </div>
  );
};

export default DesignPopup;

DesignPopup.propTypes = {
  refs: shape({
    pageRef: object,
    pageInnerRef: object,
  }),
};

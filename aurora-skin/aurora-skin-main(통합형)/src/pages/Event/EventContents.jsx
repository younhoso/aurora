import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';

import { oneOf, arrayOf, shape, string } from 'prop-types';

import {
  useEventStateContext,
  useEventActionContext,
  useDesignPopupActionContext,
  Slider,
  Slide,
  CouponByProductProvider,
  useModalActionContext,
} from '@shopby/react-components';
import { CLIENT_ERROR, CLIENT_ERROR_MESSAGE, PLATFORM_TYPE, SERVER_ERROR } from '@shopby/shared';
import { PER_PAGE_COUNT } from '@shopby/shared/constants';

import GalleryListPage from '../../components/GalleryListPage/GalleryListPage';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import EventCoupon from './EventCoupon';
import EventTopImg from './EventTopImg';

const SLIDE_OPTION = {
  slidesPerView: 'auto',
};

const EventContents = ({ sortBy }) => {
  const { t } = useTranslation('title');
  const { eventNoOrId } = useParams();
  const platformType = useOutletContext();
  const { openAlert } = useModalActionContext();
  const [searchParams] = useSearchParams();
  const channelType = searchParams.get('channelType');

  const [disabled, setDisabled] = useState(false);
  const { label, coupon, sortType, tabId, listOfExhibition, top, isLoading, eventNo } = useEventStateContext();
  const { fetchDisplayPopups } = useDesignPopupActionContext();
  const { fetchEventsEventNo, updateSortType, updateTabId } = useEventActionContext();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [style, setStyle] = useState({});
  const [currentProducts, setCurrentProducts] = useState([]);
  const [queryString, setQueryString] = useState({
    eventNo: eventNoOrId,
    sortType,
    soldOut: true,
    saleStatus: 'ONSALE',
  });
  const topImgInfo = useMemo(() => top[platformType === 'PC' ? 'pc' : 'mobile'], [top]);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    hasBottomNav: true,
    title: t(label),
  });

  const handleInterSect = () => {
    setDisabled(true);

    if (currentProducts.length && displayProducts.length >= currentProducts.length) return;

    const result = currentProducts.slice(0, displayProducts.length + PER_PAGE_COUNT);

    setDisplayProducts(result);
    setDisabled(false);
  };

  const initEvent = () => {
    const result = listOfExhibition.find((item) => item.id === tabId);
    const perRowNo = result?.[platformType === PLATFORM_TYPE.PC ? 'pcPerRow' : 'mobilePerRow'];
    const sliceData = result.products.slice(0, PER_PAGE_COUNT);

    setStyle({
      gridTemplateColumns: `repeat(${perRowNo}, calc( 100% / ${perRowNo} - 10px))`,
    });

    setCurrentProducts(result.products);
    setDisplayProducts(sliceData);
    setDisabled(false);
  };

  const handleFetchEvent = async () => {
    try {
      await fetchEventsEventNo(tabId, queryString);
    } catch ({ error }) {
      const { code } = error.serverError;

      openAlert({
        label: '메인페이지로 돌아가기',
        message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR[SERVER_ERROR[code]]],
        onClose: () => location.replace('/'),
      });
    }
  };

  useEffect(() => {
    setQueryString((prev) => ({ ...prev, sortType }));
  }, [sortType]);

  useEffect(() => {
    handleFetchEvent();
  }, [queryString]);

  useEffect(() => {
    !!eventNo &&
      fetchDisplayPopups({
        pageType: 'EVENT',
        targetNo: eventNo,
      });
  }, [eventNo]);

  useEffect(() => {
    if (!listOfExhibition.length) return;

    initEvent();
  }, [listOfExhibition, tabId]);

  return (
    <>
      {topImgInfo && <EventTopImg imgInfo={topImgInfo} label={label} />}

      {coupon?.coupons.length > 0 && (
        <CouponByProductProvider>
          <EventCoupon coupons={coupon.coupons} channelType={channelType} />
        </CouponByProductProvider>
      )}

      {listOfExhibition.length > 0 && (
        <nav className="event-nav">
          <Slider {...SLIDE_OPTION}>
            {listOfExhibition.map((item) => (
              <Slide key={item.id}>
                <button
                  type="button"
                  data-id={item.id}
                  className={`event-nav__btn${item.id === tabId ? ' is-active' : ''}`}
                  onClick={() => {
                    updateTabId(item.id);
                  }}
                >
                  {item.label}
                </button>
              </Slide>
            ))}
          </Slider>
        </nav>
      )}

      <GalleryListPage
        style={style}
        totalCount={currentProducts.length}
        products={displayProducts}
        sortType={sortType}
        sortBy={sortBy}
        updateSortType={updateSortType}
        handleIntersect={handleInterSect}
        disabled={disabled}
        isLoading={isLoading}
        className="event-list"
      />
    </>
  );
};

export default EventContents;

EventContents.propTypes = {
  sortBy: arrayOf(
    shape({
      value: oneOf(['SALE', 'ADMIN_SETTING', 'BEST_SELLER', 'BEST_REVIEW']),
      label: string,
    })
  ),
};

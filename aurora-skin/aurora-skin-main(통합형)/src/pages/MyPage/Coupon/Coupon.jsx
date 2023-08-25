import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

import { bool, number, func } from 'prop-types';

import {
  Button,
  CouponProvider,
  VisibleComponent,
  useCouponActionContext,
  useModalActionContext,
  useInfiniteScroll,
  useCouponStateContext,
  InfiniteScrollLoader,
  TabsProvider,
  useTabsStateContext,
  Tabs,
} from '@shopby/react-components';

import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import TitleModal from '../../../components/TitleModal';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../../constants/common';
import useLayoutChanger from '../../../hooks/useLayoutChanger';
import CouponRegistration from '../CouponRegistration';
import TotalCount from '../TotalCount';

import CouponItem from './CouponItem';

const Coupons = forwardRef(({ canUse, totalCount }, ref) => {
  const { fetchCoupons } = useCouponActionContext();

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      const { data } = await fetchCoupons(requestOption);

      return data.items;
    },
    requestOption: {
      pageNumber: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      canUse,
      sortDirection: 'DESC',
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  useEffect(() => {
    fetchInitialItems({
      requestOption: {
        canUse,
      },
    });
  }, [canUse]);

  useImperativeHandle(ref, () => ({
    fetchCoupons: fetchInitialItems,
  }));

  if (totalCount === 0) {
    if (isLoading) return <ListSkeleton isLoading={isLoading} />;

    return <EmptyCoupon />;
  }

  return (
    <>
      <ul className="my-page-coupon__list">
        {accumulativeItems.map((item) => (
          <CouponItem key={item.couponIssueNo} coupon={item} unissuable={!canUse} />
        ))}
      </ul>
      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
      />
      <ListSkeleton isLoading={isLoading} />
    </>
  );
});

Coupons.displayName = 'Coupons';

Coupons.propTypes = {
  canUse: bool,
  totalCount: number,
  onTotalCountChange: func,
};

const EmptyCoupon = () => (
  <div className="empty-list">
    <p>보유한 쿠폰이 없습니다.</p>
  </div>
);

const CouponContent = () => {
  const issuableCouponRef = useRef();

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const { openAlert } = useModalActionContext();
  const { fetchProfileCouponSummary } = useCouponActionContext();

  const {
    profileCouponSummary: { usableCouponCnt },
  } = useCouponStateContext();
  const { currentTab } = useTabsStateContext();
  const {
    coupon: { totalCount },
  } = useCouponStateContext();
  const isIssuable = currentTab === 'ISSUABLE';

  const handleRegistrationButtonClick = () => {
    setIsRegistrationModalOpen(true);
  };

  useEffect(() => {
    fetchProfileCouponSummary();
  }, []);

  return (
    <>
      <div className="my-page-coupon__wrap">
        <VisibleComponent
          shows={isIssuable}
          TruthyComponent={
            <>
              <TotalCount title="사용가능 쿠폰 수" count={usableCouponCnt} />
              <Button
                className="my-page-coupon__registration-button"
                theme="dark"
                label="쿠폰 번호 등록"
                onClick={handleRegistrationButtonClick}
              />
            </>
          }
        />
        <p className="my-page-coupon__list-title">보유 쿠폰 리스트</p>
        <Coupons ref={issuableCouponRef} canUse={isIssuable} totalCount={totalCount} />
      </div>

      <VisibleComponent
        shows={isRegistrationModalOpen}
        TruthyComponent={
          <TitleModal
            className="coupon-registration-modal"
            title="쿠폰 번호 입력"
            onClose={() => setIsRegistrationModalOpen(false)}
          >
            <CouponRegistration
              onCancel={() => setIsRegistrationModalOpen(false)}
              onRegister={async () => {
                await openAlert({
                  message: '쿠폰이 등록됐습니다.',
                  onClose: async () => {
                    await fetchProfileCouponSummary();
                    await issuableCouponRef.current.fetchCoupons();
                    await setIsRegistrationModalOpen(false);
                  },
                });
              }}
            />
          </TitleModal>
        }
      />
    </>
  );
};

const DEFAULT_TABS = [
  {
    value: 'ISSUABLE',
    label: '사용 가능 쿠폰',
  },
  {
    value: 'UNISSUABLE',
    label: '사용 불가 쿠폰',
  },
];

const Coupon = () => {
  useLayoutChanger({
    title: '쿠폰',
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <CouponProvider>
      <TabsProvider
        initialState={{
          currentTab: 'ISSUABLE',
          tabs: DEFAULT_TABS,
        }}
      >
        <div className="my-page-coupon">
          <Tabs className="my-page-coupon__tabs" />
          <CouponContent />
        </div>
      </TabsProvider>
    </CouponProvider>
  );
};

export default Coupon;

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { debounce } from 'lodash-es';

import {
  ClaimProvider,
  InfiniteScrollLoader,
  MyClaimProvider,
  Skeleton,
  Tabs,
  TabsProvider,
  useClaimActionContext,
  useModalActionContext,
  useMyClaimActionContext,
  useMyClaimStateContext,
  useTabsStateContext,
  VisibleComponent,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import StartYmdSelector from '../../../components/StartYmdSelector';
import useLayoutChanger from '../../../hooks/useLayoutChanger';

import ClaimSummary from './ClaimSummary';

const PAGE_SIZE = 10;
const CLAIMS_TABS = [
  ['ALL', '전체'],
  ['RETURN', '반품'],
  ['EXCHANGE', '교환'],
  ['CANCEL', '취소'],
].map(([value, label]) => ({ value, label }));

const ListSkeleton = () => (
  <>
    {Array(4)
      .fill(null)
      .map((_, idx) => (
        <Skeleton key={idx} type="LIST" />
      ))}
  </>
);

const ClaimsContent = () => {
  const { fetchClaims } = useMyClaimActionContext();
  const { claimsWithAccumulation, totalClaimsCount } = useMyClaimStateContext();
  const { withdrawClaimByOrderOptionNo } = useClaimActionContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { currentTab } = useTabsStateContext();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isInfiniteScrollLoaderDisabled, setIsInfiniteScrollLoaderDisabled] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const { catchError } = useErrorBoundaryActionContext();

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
    title: '클레임 내역',
  });

  const claimsRequestOption = useMemo(
    () => ({
      claimTypes: currentTab === 'ALL' ? undefined : [currentTab],
      pageSize: PAGE_SIZE,
      startYmd: searchParams.get('startYmd') ?? '',
      endYmd: searchParams.get('endYmd') ?? '',
    }),
    [searchParams, currentTab]
  );

  const initializeClaims = useCallback(
    debounce(async (claimsRequestOption) => {
      await fetchClaims({ ...claimsRequestOption, pageNumber: 1 });
      setPageNumber(1);
      setIsInfiniteScrollLoaderDisabled(false);
      setIsLoading(false);
    }, 500),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    initializeClaims(claimsRequestOption);
  }, [claimsRequestOption]);

  const handleIntersect = async () => {
    setIsInfiniteScrollLoaderDisabled(true);

    if (totalClaimsCount / claimsRequestOption.pageSize < pageNumber) return;
    await fetchClaims({ ...claimsRequestOption, pageNumber: pageNumber + 1 });
    setPageNumber((pageNumber) => pageNumber + 1);
    setIsInfiniteScrollLoaderDisabled(false);
  };

  const handleWithdrawClaimBtnClick = (e, orderOptionNo, withdrawTypeLabel) => {
    openConfirm({
      message: `${withdrawTypeLabel}를 진행하시겠습니까?`,
      onConfirm: async () => {
        try {
          await withdrawClaimByOrderOptionNo(orderOptionNo);
          openAlert({
            message: `철회가 완료되었습니다.`,
            onClose: () => {
              initializeClaims(claimsRequestOption);
            },
          });
        } catch (e) {
          catchError(e);
        }
      },
      confirmLabel: '신청',
    });
  };

  return (
    <div className="claims">
      <Tabs className="claims__tabs" />
      <section className="claims__content">
        <StartYmdSelector className="claims__period-select" initialOffsetOption="7d" />
        <VisibleComponent
          shows={!isLoading}
          FalsyComponent={<ListSkeleton />}
          TruthyComponent={
            <VisibleComponent
              shows={Boolean(claimsWithAccumulation?.length)}
              FalsyComponent={<p className="claims__no-items bold">내역이 없습니다.</p>}
              TruthyComponent={
                <>
                  {claimsWithAccumulation?.map(({ claimNo, claimYmdt, orderNo, claimedOptions }) => (
                    <ClaimSummary
                      key={claimNo}
                      claimYmdt={claimYmdt}
                      orderNo={orderNo}
                      claimedOptions={claimedOptions}
                      onWithdrawClaimBtnClick={handleWithdrawClaimBtnClick}
                    />
                  ))}
                  <InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollLoaderDisabled} />
                </>
              }
            />
          }
        />
      </section>
    </div>
  );
};

const Claims = () => {
  const initialTabsState = {
    tabs: CLAIMS_TABS,
  };

  return (
    <MyClaimProvider willClaimsBeAccumulated={true}>
      <ClaimProvider>
        <TabsProvider initialState={initialTabsState} usesQueryParam={true} queryParamKeyName={'claimType'}>
          <ClaimsContent />
        </TabsProvider>
      </ClaimProvider>
    </MyClaimProvider>
  );
};

export default Claims;

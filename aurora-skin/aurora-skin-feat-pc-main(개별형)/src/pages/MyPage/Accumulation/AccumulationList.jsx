import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  InfiniteScrollLoader,
  VisibleComponent,
  useProfileAccumulationActionContext,
  useProfileAccumulationStateContext,
  useMallStateContext,
  useInfiniteScroll,
} from '@shopby/react-components';
import { convertToKoreanCurrency, getDateLabel } from '@shopby/shared';

import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../../constants/common';

const today = getDateLabel();

const ACCUMULATION_STATUS_MAP = {
  GIVE: {
    modifier: 'give',
    sign: '+',
    label: '지급',
  },
  SUBTRACTION: {
    modifier: 'subtraction',
    sign: '-',
    label: '차감',
  },
};

const EmptyList = () => {
  const {
    accumulationConfig: { accumulationName },
  } = useMallStateContext();

  return (
    <div className="empty-list">
      <p>{accumulationName} 적립 내역이 없습니다.</p>
    </div>
  );
};

const AccumulationList = () => {
  const {
    accumulationConfig: { unit },
  } = useMallStateContext();
  const { fetchProfileAccumulation } = useProfileAccumulationActionContext();
  const { profileAccumulation } = useProfileAccumulationStateContext();

  const [searchParams] = useSearchParams();

  const period = useMemo(
    () => ({
      startYmd: searchParams.get('startYmd') ?? '',
      endYmd: today,
    }),
    [searchParams]
  );

  const accumulationRequestOption = useMemo(
    () => ({
      startYmd: period.startYmd,
      endYmd: period.endYmd,
    }),
    [period]
  );

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      const { data } = await fetchProfileAccumulation(requestOption);
      return data.items;
    },
    requestOption: {
      pageNumber: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      ...accumulationRequestOption,
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount: profileAccumulation?.totalCount,
    });
  };

  useEffect(() => {
    accumulationRequestOption.startYmd &&
      fetchInitialItems({
        requestOption: {
          ...accumulationRequestOption,
        },
      });
  }, [accumulationRequestOption]);

  return (
    <>
      <VisibleComponent
        shows={profileAccumulation?.totalCount > 0}
        FalsyComponent={isLoading ? <ListSkeleton isLoading={isLoading} /> : <EmptyList />}
        TruthyComponent={
          <>
            <ul className="my-page-accumulation__list">
              {accumulativeItems.map(
                ({
                  reasonDetail,
                  accumulationNo,
                  registerYmdt,
                  accumulationAmt,
                  startYmdt,
                  expireYmdt,
                  accumulationStatus,
                }) => {
                  const date = expireYmdt ? `${startYmdt} ~ ${expireYmdt}` : '';
                  const accumulationStatusMap = ACCUMULATION_STATUS_MAP[accumulationStatus.split('_').at(0)];
                  return (
                    <li className="my-page-accumulation__item" key={accumulationNo}>
                      <p className="my-page-accumulation__date my-page-accumulation__date--register">
                        {accumulationStatusMap.label} 일시 : {registerYmdt}
                      </p>
                      <p className="my-page-accumulation__reason-detail">{reasonDetail}</p>
                      <p className="my-page-accumulation__accumulation-amount">
                        <span
                          className={`my-page-accumulation__accumulation-point my-page-accumulation__accumulation-point--${accumulationStatusMap.modifier}`}
                        >
                          {accumulationStatusMap.sign}
                          {convertToKoreanCurrency(accumulationAmt)}
                        </span>
                        <span className="my-page-accumulation__accumulation-unit">{unit ?? 'p'}</span>
                      </p>
                      {date && <p className="my-page-accumulation__date my-page-accumulation__date--expire">{date}</p>}
                    </li>
                  );
                }
              )}
            </ul>
            <ListSkeleton isLoading={isLoading} />
          </>
        }
      />
      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
      />
    </>
  );
};

export default AccumulationList;

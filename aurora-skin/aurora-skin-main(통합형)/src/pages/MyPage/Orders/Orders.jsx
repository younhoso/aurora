import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  InfiniteScrollLoader,
  MyOrderProvider,
  Skeleton,
  useMyOrderActionContext,
  useMyOrderStateContext,
  VisibleComponent,
} from '@shopby/react-components';

import StartYmdSelector from '../../../components/StartYmdSelector';
import useLayoutChanger from '../../../hooks/useLayoutChanger';

import OrderSummary from './OrderSummary';

const PAGE_SIZE = 10;

const ListSkeleton = () => (
  <>
    {Array(4)
      .fill(null)
      .map((_, idx) => (
        <Skeleton key={idx} type="LIST" />
      ))}
  </>
);

const OrdersContent = () => {
  const { ordersWithAccumulation, totalOrdersCount } = useMyOrderStateContext();
  const { fetchOrders } = useMyOrderActionContext();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isInfiniteScrollLoaderDisabled, setIsInfiniteScrollLoaderDisabled] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  useLayoutChanger({
    title: '주문/배송 목록',
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
    hasBackBtnOnHeader: true,
  });

  const period = useMemo(
    () => ({
      startYmd: searchParams.get('startYmd') ?? '',
      endYmd: searchParams.get('endYmd') ?? '',
    }),
    [searchParams]
  );

  const ordersRequestOption = useMemo(
    () => ({
      pageSize: PAGE_SIZE,
      startYmd: period.startYmd,
      endYmd: period.endYmd,
    }),
    [period]
  );

  useEffect(() => {
    (async () => {
      await fetchOrders({ ...ordersRequestOption, pageNumber: 1 });
      setPageNumber(1);
      setIsInfiniteScrollLoaderDisabled(false);
      setIsLoading(false);
    })();
  }, [ordersRequestOption]);

  const handleIntersect = async () => {
    setIsInfiniteScrollLoaderDisabled(true);
    if (totalOrdersCount / ordersRequestOption.pageSize < pageNumber) return;

    await fetchOrders({ ...ordersRequestOption, pageNumber: pageNumber + 1 });
    setPageNumber((pageNumber) => pageNumber + 1);
    setIsInfiniteScrollLoaderDisabled(false);
  };

  if (ordersWithAccumulation?.length === 0) {
    return (
      <div className="orders">
        <StartYmdSelector initialOffsetOption="7d" />
        <p className="orders__no-data">주문 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <StartYmdSelector initialOffsetOption="7d" />
      <VisibleComponent
        shows={!isLoading}
        FalsyComponent={<ListSkeleton />}
        TruthyComponent={
          <>
            {ordersWithAccumulation?.map(({ firstOrderAmt, orderOptions, orderNo, orderYmdt }) => {
              const orderYmd = orderYmdt.slice(0, 10);
              const orderTitle =
                orderOptions[0].productName + (orderOptions.length > 1 ? ` 외 ${orderOptions.length - 1}건` : '');

              return (
                <OrderSummary
                  key={orderNo}
                  orderYmd={orderYmd}
                  orderTitle={orderTitle}
                  imageUrl={orderOptions[0].imageUrl}
                  orderNo={orderNo}
                  totalProductAmt={firstOrderAmt.totalProductAmt}
                  redirectUrl={`/orders/${orderNo}`}
                />
              );
            })}
            <InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollLoaderDisabled} />
          </>
        }
      />
    </div>
  );
};

const Orders = () => (
  <MyOrderProvider willOrdersBeAccumulated={true}>
    <OrdersContent />
  </MyOrderProvider>
);

export default Orders;

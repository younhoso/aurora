import { useEffect, useState } from 'react';

import { number } from 'prop-types';

import {
  ArticleProvider,
  useArticleStateContext,
  useArticleActionContext,
  useMallStateContext,
  VisibleComponent,
  useInfiniteScroll,
  InfiniteScrollLoader,
  Icon,
} from '@shopby/react-components';

import ListSkeleton from '../../components/ListSkeleton/ListSkeleton';
import { NOTICE_BOARD_ID } from '../../constants/board';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import NoticeDetailModal from './NoticeDetailModal';

const EmptyNoticeContent = () => (
  <div className="empty-list">
    <p>등록된 공지사항이 없습니다.</p>
  </div>
);

const LockedNotice = ({ articleNo }) => (
  <li className="notice__list-item--locked" key={articleNo}>
    <Icon className="ico ico--lock" name="lock" />
    <p>비밀글입니다.</p>
  </li>
);

LockedNotice.propTypes = {
  articleNo: number,
};

const NoticeContent = () => {
  const { fetchArticles } = useArticleActionContext();
  const {
    article: { totalCount },
  } = useArticleStateContext();
  const { mallName, boardsCategories } = useMallStateContext();
  const notice = boardsCategories.find(({ boardId }) => boardId === NOTICE_BOARD_ID);

  const [noticeNo, setNoticeNo] = useState(null);

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      const { data } = await fetchArticles(requestOption);

      return data.items;
    },
    requestOption: {
      pageNumber: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      boardNo: 'notice',
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
        boardNo: 'notice',
      },
    });
  }, []);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    title: notice?.boardName,
  });

  return (
    <div className="notice">
      <div className="notice__title">
        <p>{mallName} 에서 알려드립니다.</p>
      </div>
      <VisibleComponent
        shows={totalCount > 0}
        TruthyComponent={
          <>
            <ul className="notice__list">
              {accumulativeItems.map((item) => (
                <VisibleComponent
                  key={item.articleNo}
                  shows={item.secreted}
                  TruthyComponent={<LockedNotice key={item.articleNo} articleNo={item.articleNo} />}
                  FalsyComponent={
                    <li key={item.articleNo}>
                      <button
                        className="notice__list-button"
                        onClick={() => {
                          setNoticeNo(() => item.articleNo);
                        }}
                      >
                        <div>
                          <p className="notice__category-label">{item.notice ? '[공지]' : ''}</p>
                          <p className="notice__date">{item.registerYmdt.split(' ').at(0)}</p>
                        </div>
                        <p className="notice__tit">{item.title}</p>
                      </button>
                    </li>
                  }
                />
              ))}
            </ul>
            <VisibleComponent
              shows={accumulativeItems.length > 0}
              TruthyComponent={
                <InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />
              }
            />
            <ListSkeleton isLoading={isLoading} />
          </>
        }
        FalsyComponent={<EmptyNoticeContent />}
      />

      {noticeNo && (
        <NoticeDetailModal
          noticeNo={noticeNo}
          onClose={() => {
            setNoticeNo(null);
          }}
        />
      )}
    </div>
  );
};

const Notice = () => (
  <ArticleProvider>
    <NoticeContent />
  </ArticleProvider>
);

export default Notice;

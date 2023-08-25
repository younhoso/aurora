import { useEffect, useMemo, useState } from 'react';

import { number, func } from 'prop-types';

import {
  useArticleActionContext,
  useArticleStateContext,
  IconSVG,
  VisibleComponent,
  useMallStateContext,
} from '@shopby/react-components';

import FullModal from '../../components/FullModal';
import GoToList from '../../components/GoToList';
import Sanitized from '../../components/Sanitized';
import { NOTICE_BOARD_ID } from '../../constants/board';

const NoticeDetailModal = ({ noticeNo: initialNoticeNo, onClose }) => {
  const { fetchArticleDetailBy } = useArticleActionContext();
  const {
    articleDetail,
    article: { items, totalCount },
  } = useArticleStateContext();
  const { boardsCategories } = useMallStateContext();

  const [noticeNo, setNoticeNo] = useState(initialNoticeNo);
  const [previousNotice, setPreviousNotice] = useState(null);
  const [nextNotice, setNextNotice] = useState(null);

  const notice = boardsCategories.find(({ boardId }) => boardId === NOTICE_BOARD_ID);
  const noticesWithoutSecretArticles = useMemo(() => items.filter(({ secreted }) => !secreted), [items]);

  useEffect(() => {
    if (noticeNo > 0) {
      fetchArticleDetailBy({ articleNo: noticeNo, boardNo: 'notice' });

      const currentIndex = noticesWithoutSecretArticles.findIndex((item) => item.articleNo === noticeNo);

      setPreviousNotice(() => {
        if (currentIndex < totalCount - 1) {
          return items[currentIndex + 1];
        }

        return null;
      });

      setNextNotice(() => {
        if (currentIndex > 0) {
          return items[currentIndex - 1];
        }

        return null;
      });
    }
  }, [noticeNo]);

  return (
    <FullModal title={notice.boardName} onClose={onClose}>
      <div className="notice-detail__title-box">
        <p className="notice-detail__title">
          <span>[공지]</span>
          {articleDetail.title}
        </p>
        <p className="notice-detail__date">{articleDetail.registerYmdt.split(' ').at(0)}</p>
      </div>
      <div className="notice-detail__content editor">
        <Sanitized html={articleDetail.content} />
      </div>
      <div>
        <VisibleComponent
          shows={nextNotice}
          TruthyComponent={
            <button
              className="notice-detail__index notice-detail__index--next"
              onClick={() => {
                nextNotice?.articleNo > 0 && setNoticeNo(nextNotice?.articleNo);
              }}
            >
              <span className="notice-detail__index-angle">
                <IconSVG name="angle-r" fill="transparent" stroke="#3f434c" strokeWidth={6} />
              </span>
              <p className="notice-detail__index-text-flag">다음글</p>
              <p className="notice-detail__index-title">{nextNotice?.title}</p>
            </button>
          }
        />
        <VisibleComponent
          shows={previousNotice}
          TruthyComponent={
            <button
              className="notice-detail__index notice-detail__index--previous"
              onClick={() => {
                previousNotice?.articleNo > 0 && setNoticeNo(previousNotice?.articleNo);
              }}
            >
              <span className="notice-detail__index-angle">
                <IconSVG name="angle-r" fill="transparent" stroke="#3f434c" strokeWidth={6} />
              </span>
              <p className="notice-detail__index-text-flag">이전글</p>
              <p className="notice-detail__index-title">{previousNotice?.title}</p>
            </button>
          }
        />
        <GoToList onClick={onClose} title="목록보기" />
      </div>
    </FullModal>
  );
};

NoticeDetailModal.propTypes = {
  noticeNo: number,
  currentIndex: number,
  onClose: func,
};

export default NoticeDetailModal;

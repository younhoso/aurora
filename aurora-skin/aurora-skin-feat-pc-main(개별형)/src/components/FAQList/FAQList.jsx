import { useState, useCallback, useEffect } from 'react';

import { number, string, array, bool } from 'prop-types';

import {
  Icon,
  IconBtn,
  VisibleComponent,
  useArticleActionContext,
  useArticleStateContext,
} from '@shopby/react-components';

import ListSkeleton from '../../components/ListSkeleton/ListSkeleton';
import Sanitized from '../Sanitized';

const EmptyFAQList = () => (
  <div className="empty-list">
    <p>등록된 FAQ가 없습니다.</p>
  </div>
);

const LockedFAQ = ({ articleNo }) => (
  <li key={articleNo} className={'faq-list__content-wrap customer-center__content-warp'}>
    <div className="faq-list__content faq-list__question customer-center__content customer-center__content--question">
      <Icon className="ico ico--lock" name="lock" />
      <p>비밀글입니다.</p>
    </div>
  </li>
);

LockedFAQ.propTypes = {
  articleNo: number,
};

const FAQList = ({ questions, faqNo, isLoading }) => {
  const { fetchArticleDetailBy } = useArticleActionContext();
  const { articleDetail } = useArticleStateContext();

  const [selectedAnswerNo, setSelectedAnswerNo] = useState(0);

  const showsAnswer = useCallback((articleNo) => selectedAnswerNo === articleNo, [selectedAnswerNo]);
  const handleQuestionClick = useCallback(
    (articleNo) => setSelectedAnswerNo((prevNo) => (prevNo === articleNo ? 0 : articleNo)),
    []
  );

  useEffect(() => {
    if (selectedAnswerNo > 0) {
      fetchArticleDetailBy({
        boardNo: faqNo,
        articleNo: selectedAnswerNo,
      });
    }
  }, [selectedAnswerNo]);
  if (isLoading) return <ListSkeleton isLoading={isLoading} />;

  return (
    <VisibleComponent
      shows={questions.length > 0}
      TruthyComponent={
        <ul className="faq-list">
          {questions.map((faq) => (
            <VisibleComponent
              key={faq.articleNo}
              shows={faq.secreted}
              TruthyComponent={<LockedFAQ key={faq.articleNo} articleNo={faq.articleNo} />}
              FalsyComponent={
                <li
                  key={faq.articleNo}
                  className={`faq-list__content-wrap customer-center__content-warp${
                    showsAnswer(faq.articleNo) ? ' is-open' : ''
                  }`}
                  onClick={() => handleQuestionClick(faq.articleNo)}
                >
                  <div className="faq-list__content faq-list__question customer-center__content customer-center__content--question">
                    <span className="ico ico--q"></span>
                    <p>
                      {faq.notice ? '[공지]' : ''} {faq.title}
                    </p>
                    <IconBtn className="arrow" iconType="angle-down" />
                  </div>
                  {showsAnswer(faq.articleNo) && articleDetail.content && (
                    <div className="faq-list__content editor faq-list__answer customer-center__content customer-center__content--answer">
                      <span className="ico ico--a"></span>
                      <Sanitized className="sanitize-wrap" html={articleDetail.content} style={{ width: '100%' }} />
                    </div>
                  )}
                </li>
              }
            />
          ))}
        </ul>
      }
      FalsyComponent={<EmptyFAQList />}
    />
  );
};

export default FAQList;

FAQList.displayName = 'FAQList';

FAQList.propTypes = {
  faqNo: number,
  pageSize: number,
  keyword: string,
  questions: array,
  isLoading: bool,
};

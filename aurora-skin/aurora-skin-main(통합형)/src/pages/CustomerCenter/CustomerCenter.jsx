import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ArticleProvider,
  useMallStateContext,
  useArticleActionContext,
  useArticleStateContext,
  Button,
  useBoardConfigurationContextState,
  useModalActionContext,
  VisibleComponent,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

import FAQList from '../../components/FAQList/FAQList';
import GoToList from '../../components/GoToList';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const FAQ = () => {
  const navigate = useNavigate();

  const { boardsCategories } = useMallStateContext();
  const { boardConfig } = useBoardConfigurationContextState();
  const { fetchArticles } = useArticleActionContext();
  const { openAlert } = useModalActionContext();
  const {
    isLoading,
    article: { items, totalCount },
  } = useArticleStateContext();

  const faqConfig = useMemo(
    () => boardsCategories.find(({ boardId }) => boardId?.toLowerCase().includes('faq')),
    [boardsCategories]
  );

  const inquiryButtonLabel = useMemo(() => {
    const { name } = boardConfig?.inquiryConfig ?? {};
    return name ? name : '1:1문의';
  }, [boardConfig?.inquiryConfig?.name]);

  const faqFlag = useMemo(() => {
    if (!faqConfig?.used) return '--not-used';

    if (!totalCount) return '--empty';

    return '';
  }, [faqConfig, totalCount]);

  const goToPersonalInquiryPage = () => {
    if (!isSignedIn()) {
      openAlert({
        message: '로그인하셔야 본 서비스를 이용하실 수 있습니다.',
      });
    }
    navigate('/my-page/personal-inquiry');
  };

  useEffect(() => {
    if (!faqConfig?.boardNo || !faqConfig.used) return;

    fetchArticles({
      boardNo: faqConfig?.boardNo,
      pageNumber: 1,
      pageSize: 5,
    });
  }, [faqConfig?.boardNo]);

  return (
    <div className={`customer-center__faq${faqFlag}`}>
      <p className="customer-center__faq-title">{faqConfig?.boardName ?? 'FAQ'}</p>
      <VisibleComponent
        shows={faqConfig?.used}
        TruthyComponent={<FAQList isLoading={isLoading} questions={items} faqNo={faqConfig?.boardNo} />}
        FalsyComponent={
          <div className="empty-list">
            <p>존재하지 않는 게시판입니다.</p>
          </div>
        }
      />
      <GoToList
        title="전체보기"
        disabled={!faqConfig?.used}
        onClick={() => {
          location.href = '/faq';
        }}
      />
      <div className="customer-center__inquiry">
        <Button className="customer-center__inquiry-button" onClick={goToPersonalInquiryPage}>
          {inquiryButtonLabel}
        </Button>
      </div>
    </div>
  );
};

const CustomerServiceCenterInformation = () => {
  const {
    mall: { serviceCenter },
  } = useMallStateContext();

  return (
    <div className="customer-center__information">
      <p className="customer-center__name">고객센터</p>
      <p>{serviceCenter.phoneNo}</p>
      <p>{serviceCenter.email}</p>
    </div>
  );
};

const CustomerCenterContent = () => {
  const { t } = useTranslation('title');

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    hasCartBtnOnHeader: true,
    title: t('customerCenter'),
  });

  return (
    <div className="customer-center">
      <FAQ />
      <CustomerServiceCenterInformation />
    </div>
  );
};

const CustomerCenter = () => (
  <ArticleProvider>
    <CustomerCenterContent />
  </ArticleProvider>
);

export default CustomerCenter;

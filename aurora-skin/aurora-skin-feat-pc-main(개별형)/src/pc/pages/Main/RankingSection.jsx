import { Tabs, TabsProvider, useMallStateContext, useTabsStateContext } from '@shopby/react-components';
import { useEffect, useState, useCallback } from 'react';
import ProductSectionWrap from './ProductSectionWrap';
import { fetchHttpRequest } from '../../../utils';

const RANKING = 'RANKING';

const rankingRequest = {
  url: `display/sections/ids/${RANKING}`,
  query: {
    pageNumber: 0,
    pageSize: 0,
    hasTotalCount: true,
    hasOptionValues: true,
    by: 'SALE',
    soldout: true,
    saleStatus: 'ONSALE',
  },
};

const reviewRequest = {
  url: 'products/best-review/search',
  query: {
    'filter.familyMalls': true,
    hasTotalCount: true,
    hasOptionValues: true,
  },
};

const RANKING_TAB = {
  currentTab: RANKING,
  tabs: [
    {
      label: '인기 랭킹',
      value: RANKING,
    },
    {
      label: '베스트 리뷰',
      value: 'BEST_REVIEW',
    },
  ],
};

const RankingSectionContent = ({ rankingSection, reviewSection }) => {
  const { currentTab } = useTabsStateContext();

  const section = currentTab === RANKING ? rankingSection : reviewSection;

  return (
    <ProductSectionWrap className="ranking" platformType="PC" sectionsId={RANKING} section={section}>
      <Tabs />
    </ProductSectionWrap>
  );
};

const RankingSection = () => {
  const { clientId } = useMallStateContext();

  const [rankingSection, setRankingSection] = useState({});
  const [reviewSection, setReviewSection] = useState({});

  const updateSectionData = useCallback(({ ranking, review }) => {
    ranking.title = '랭킹 차트';

    setRankingSection(() => ranking);
    setReviewSection(() => ({
      ...ranking,
      products: review.items,
    }));
  }, []);

  useEffect(() => {
    if (!clientId) return;

    (async () => {
      const ranking = await fetchHttpRequest(rankingRequest);

      const review = await fetchHttpRequest(reviewRequest);

      updateSectionData({
        ranking,
        review,
      });
    })();
  }, [clientId]);

  return (
    <TabsProvider initialState={RANKING_TAB}>
      <RankingSectionContent rankingSection={rankingSection} reviewSection={reviewSection} />
    </TabsProvider>
  );
};

export default RankingSection;

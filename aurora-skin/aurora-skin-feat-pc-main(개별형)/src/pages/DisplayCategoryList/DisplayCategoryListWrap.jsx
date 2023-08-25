import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  usePageScriptsActionContext,
  useProductSearchActionContext,
  useProductSearchStateContext,
} from '@shopby/react-components';

import GalleryListPage from '../../components/GalleryListPage';

const PER_PAGE_COUNT = 10;
const PARAM_TYPE = {
  KEYWORD: 'keyword',
  CATEGORY_NO: 'categoryNo',
};
const SORT_BY = [
  { value: 'POPULAR', label: '판매량순' },
  { value: 'LOW_PRICE', label: '낮은가격순' },
  { value: 'HIGH_PRICE', label: '높은가격순' },
  { value: 'REVIEW', label: '상품후기순' },
  { value: 'RECENT_PRODUCT', label: '등록일순' },
];

const DisplayCategoryListWrap = () => {
  const { pageNumber, totalCount, sortType, accumulationProducts, productSearchResponse, isLoading } =
    useProductSearchStateContext();
  const { searchProductsBy, updateSortType } = useProductSearchActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const [disabled, setDisabled] = useState(false);
  const [searchParams] = useSearchParams();

  const keywords = useMemo(() => searchParams.get(PARAM_TYPE.KEYWORD), [searchParams]);
  const categoryNos = useMemo(() => searchParams.get(PARAM_TYPE.CATEGORY_NO), [searchParams]);
  const [queryString, setQueryString] = useState({
    categoryNos: categoryNos ?? '',
    keywords,
    pageNumber,
    sortType,
    pageSize: PER_PAGE_COUNT,
    soldOut: true,
    saleStatus: 'ONSALE',
  });

  const handleIntersect = () => {
    setDisabled(true);
    if (accumulationProducts.length >= totalCount) return;
    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    setQueryString((prev) => ({
      ...prev,
      sortType,
      pageNumber: 1,
      categoryNos,
    }));
  }, [sortType, categoryNos]);

  useEffect(() => {
    searchProductsBy(queryString);
    setDisabled(false);
  }, [queryString]);

  useEffect(() => {
    if (!productSearchResponse) return;

    if (searchParams.get('keyword')) {
      applyPageScripts('PRODUCT_SEARCH', { searchedProduct: productSearchResponse });

      return;
    }
    applyPageScripts('PRODUCT_LIST', { searchedProduct: productSearchResponse });
  }, [productSearchResponse, searchParams]);

  return (
    <GalleryListPage
      totalCount={totalCount}
      products={accumulationProducts}
      sortType={sortType}
      sortBy={SORT_BY}
      updateSortType={updateSortType}
      handleIntersect={handleIntersect}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
};

export default DisplayCategoryListWrap;

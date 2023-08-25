import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ProductSearchProvider, CategoriesProvider, VisibleComponent } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import DisplayCategoryListWrap from './DisplayCategoryListWrap';
import CategoryMenu from './menu/CategoryMenu';

const DisplayCategoryList = () => {
  const { t } = useTranslation('title');

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const categoryNo = Number(searchParams.get('categoryNo'));
  const depth = Number(searchParams.get('depth') ?? 1);

  if (keyword) {
    useLayoutChanger({
      hasBackBtnOnHeader: true,
      hasBottomNav: true,
      hasCartBtnOnHeader: true,
      title: keyword,
      hasSearchKeywordHeader: true,
    });
  } else {
    useLayoutChanger({
      hasBackBtnOnHeader: true,
      hasBottomNav: true,
      hasCartBtnOnHeader: true,
      title: t('상품 목록'),
    });
  }

  return (
    <ProductSearchProvider>
      <VisibleComponent
        shows={!keyword}
        TruthyComponent={
          <CategoriesProvider>
            <CategoryMenu categoryNo={categoryNo} depth={depth} />
          </CategoriesProvider>
        }
      />
      <DisplayCategoryListWrap />
    </ProductSearchProvider>
  );
};

export default DisplayCategoryList;

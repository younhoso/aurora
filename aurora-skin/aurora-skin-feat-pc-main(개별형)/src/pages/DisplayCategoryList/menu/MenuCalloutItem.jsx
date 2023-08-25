import { useSearchParams } from 'react-router-dom';

import { useCategoriesStateContext } from '@shopby/react-components';

const MenuCalloutItem = () => {
  const { parentCategories, currentCategories } = useCategoriesStateContext();
  const [searchParams] = useSearchParams();

  if (!parentCategories.categoryInfo.label) return <></>;

  const currentCategoryNo = Number(searchParams.get('categoryNo'));

  return (
    <div className="category-callout__sub">
      <nav className="category-callout__sub-nav">
        <a
          className="category-callout__link"
          href={`/products?categoryNo=${parentCategories?.categoryInfo?.categoryNo}`}
        >
          전체보기 {'>'}
        </a>
        {currentCategories.categories?.map((category) => (
          <a
            key={category.categoryNo}
            className={`${currentCategoryNo === category.categoryNo ? 'is-active' : ''} category-callout__link`}
            href={`/products?categoryNo=${category.categoryNo}&depth=${category.depth}`}
          >
            {category.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default MenuCalloutItem;

import { useCategoriesActionContext, useCategoriesStateContext } from '@shopby/react-components';

import MenuCalloutItem from './MenuCalloutItem';

const MenuCallout = () => {
  const { parentCategories } = useCategoriesStateContext();
  const { searchCategoryMenu } = useCategoriesActionContext();

  if (!parentCategories.categoryInfo.label) return <></>;

  const onClickCalloutMenu = ({ currentCategoryNo, categoryNo, depth }) => {
    if (currentCategoryNo === categoryNo) return;

    searchCategoryMenu({ categoryNo, depth });
  };

  return (
    <section className="category-callout">
      <h3 className="a11y">하위 메뉴 패널</h3>
      <menu className="category-callout__list">
        {parentCategories.categories.map((category) => (
          <li
            key={category.categoryNo}
            className={`${parentCategories.categoryInfo?.categoryNo === category.categoryNo ? 'is-active' : ''}`}
          >
            <button
              className="category-callout__btn"
              onClick={() => {
                onClickCalloutMenu({
                  currentCategoryNo: parentCategories.categoryInfo?.categoryNo,
                  categoryNo: category.categoryNo,
                  depth: category.depth,
                });
              }}
            >
              {category.label}
            </button>
            {parentCategories.categoryInfo?.categoryNo === category.categoryNo && <MenuCalloutItem />}
          </li>
        ))}
      </menu>
    </section>
  );
};
export default MenuCallout;

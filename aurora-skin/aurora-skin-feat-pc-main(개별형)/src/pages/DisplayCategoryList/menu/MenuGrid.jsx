import { Link } from 'react-router-dom';

import { useCategoriesStateContext } from '@shopby/react-components';

const MenuGrid = () => {
  const { currentCategories, childCategories } = useCategoriesStateContext();

  if (!currentCategories.categoryInfo?.label) return <></>;

  return (
    <nav className="category-menu">
      <ul className="category-menu__slide">
        {currentCategories.categories.map((category) => (
          <li key={category.categoryNo}>
            <Link
              className={`category-menu__link ${
                currentCategories.categoryInfo.categoryNo === category.categoryNo ? 'is-active' : ''
              }`}
              to={`/products?categoryNo=${category.categoryNo}&depth=${category.depth}`}
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="category-menu__list">
        {childCategories.categories?.map((lowerMenu) => (
          <li key={lowerMenu.categoryNo}>
            <Link
              className="category-menu__link"
              to={`/products?categoryNo=${lowerMenu.categoryNo}&depth=${lowerMenu.depth}`}
            >
              {lowerMenu.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuGrid;

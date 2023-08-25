import { useEffect } from 'react';

import { number } from 'prop-types';

import { useCategoriesActionContext } from '@shopby/react-components';

import MenuBreadCrumb from './MenuBreadCrumb';
import MenuGrid from './MenuGrid';

const CategoryMenu = ({ categoryNo, depth }) => {
  const { searchCategoryMenu, toggleCallout } = useCategoriesActionContext();

  useEffect(() => {
    searchCategoryMenu({ categoryNo, depth });
    toggleCallout(false);
  }, [categoryNo, depth]);

  return (
    <>
      <MenuBreadCrumb />
      <MenuGrid />
    </>
  );
};

export default CategoryMenu;

CategoryMenu.propTypes = {
  categoryNo: number,
  depth: number,
};

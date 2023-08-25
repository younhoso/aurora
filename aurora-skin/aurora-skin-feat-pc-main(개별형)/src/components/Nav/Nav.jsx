import { NavLink } from 'react-router-dom';

import { string } from 'prop-types';

import { Slide, Slider, useMallStateContext } from '@shopby/react-components';

const Nav = ({ className = '' }) => {
  const { categories } = useMallStateContext();

  if (!categories) return <></>;

  return (
    <nav className={`nav ${className}`}>
      <Slider slidesPerView="auto">
        {categories.multiLevelCategories.map((category) => (
          <Slide key={category.categoryNo}>
            <NavLink
              to={`/products?categoryNo=${category.categoryNo}`}
              className={({ isActive }) => (isActive ? 'is-active nav__link' : 'nav__link')}
            >
              {category.label}
            </NavLink>
          </Slide>
        ))}
      </Slider>
    </nav>
  );
};

export default Nav;

Nav.propTypes = {
  className: string,
};

import { Link } from 'react-router-dom';

import { string, func } from 'prop-types';

import { IconSVG } from '@shopby/react-components';

const BottomNav = ({ className = '', search }) => (
  <nav className={`bottom-nav ${className}`}>
    <Link to="/" className="bottom-nav__link bottom-nav__home">
      <IconSVG size={55} name="home" strokeWidth={4} />
      <span className="bottom-nav__label">홈</span>
    </Link>
    <button className="bottom-nav__link bottom-nav__link--search" onClick={search}>
      <span className="bottom-nav__label">검색</span>
    </button>
    <Link to="my-page" className="bottom-nav__link bottom-nav__link--north">
      <span className="bottom-nav__label">마이페이지</span>
    </Link>
  </nav>
);

BottomNav.propTypes = {
  className: string,
  search: func,
};

export default BottomNav;

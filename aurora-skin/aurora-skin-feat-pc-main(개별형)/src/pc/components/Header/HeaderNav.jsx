import { useCartActionContext, useCartStateContext, useAuthActionContext } from '@shopby/react-components';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { goTo } from '../../../utils';

const NavForMember = () => {
  const { signOut } = useAuthActionContext();

  const handleSignOutClick = (event) => {
    event.preventDefault();

    signOut();
    goTo('/');
  };

  return (
    <>
      <Link to="/my-page">My page</Link>
      <Link onClick={handleSignOutClick}>Sign out</Link>
    </>
  );
};

const NavForGuest = () => {
  return (
    <>
      <Link to="/sign-in">Sign in</Link>
      <Link to="/sign-up">Sign up</Link>
    </>
  );
};

const HeaderNav = () => {
  const { fetchCartCount } = useCartActionContext();
  const { cartCount } = useCartStateContext();

  const { isSignedIn } = useAuthActionContext();

  useEffect(() => {
    // count 초기화를 위해 호출
    fetchCartCount();
  }, []);

  return (
    <div className="header-nav">
      {isSignedIn() ? <NavForMember /> : <NavForGuest />}
      <Link to="/cart">
        Cart <span className="header-nav__cart-count">{cartCount}</span>
      </Link>
    </div>
  );
};

export default HeaderNav;

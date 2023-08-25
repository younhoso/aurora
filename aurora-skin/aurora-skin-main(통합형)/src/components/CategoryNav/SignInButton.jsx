import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  IconSVG,
  useAuthActionContext,
  useAuthStateContext,
  useOffCanvasActionContext,
  useOffCanvasStateContext,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

const SignInButton = () => {
  const { profile } = useAuthStateContext();
  const { fetchProfile } = useAuthActionContext();
  const { closeCanvas } = useOffCanvasActionContext();
  const { visible } = useOffCanvasStateContext();
  const [userName, setUserName] = useState();

  useEffect(() => {
    if (!isSignedIn()) return;

    (async () => {
      if (!profile) {
        await fetchProfile();
      }

      setUserName(profile?.memberName ? profile.memberName : profile?.memberNo);
    })();
  }, [isSignedIn(), visible, profile]);

  return (
    <div className="category-nav-sign-in">
      <p>
        {userName ? (
          <>
            <Link to="/my-page">{userName}</Link> 님
          </>
        ) : (
          <>
            <Link className="category-nav-sign-in__link" to="/sign-in" state={{ from: '/' }}>
              로그인
            </Link>
            을 해주세요.
          </>
        )}
      </p>
      <button className="category-nav-sign-in__close" onClick={closeCanvas}>
        <IconSVG name="x" stroke="#fff" size={30} />
        <span className="a11y">메뉴 닫기</span>
      </button>
    </div>
  );
};

export default SignInButton;

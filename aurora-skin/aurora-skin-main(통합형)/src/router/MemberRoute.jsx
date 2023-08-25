import { Suspense } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

import { node } from 'prop-types';

import { isSignedIn } from '@shopby/shared';

/**
 * MemberRoute
 * 회원만 접근 가능한 페이지인 경우, MemberRoute 를 통해 비로그인 상태 처리
 *
 * 두가지 방법으로 사용가능
 * 1) my-page 와 같이 route children 과 Outlet 을 사용
 * 2) children
 *  <MemberRoute>
 *    <노출페이지 컴포넌트 />
 *  </MemberRoute>
 * @returns
 */
const MemberRoute = ({ children }) => {
  const location = useLocation();

  if (!isSignedIn()) {
    const nextPath = `${location.pathname ?? ''}${location.search ?? ''}`;
    return <Navigate replace={true} to="/sign-in" state={{ from: nextPath ? nextPath : '/' }} />;
  }

  if (children) {
    return children;
  }

  return (
    <Suspense fallback={<></>}>
      <Outlet />
    </Suspense>
  );
};
MemberRoute.propTypes = {
  children: node,
};
export default MemberRoute;

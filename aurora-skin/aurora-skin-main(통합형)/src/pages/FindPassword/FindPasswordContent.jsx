import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';

import { Tabs, useTabsStateContext } from '@shopby/react-components';

const COMPONENT_MAP = {
  EMAIL: lazy(() => import('./FindPasswordEmailForm')),
  SMS: lazy(() => import('./FindPasswordSmsForm')),
};

const ActiveComponent = () => {
  const { currentTab } = useTabsStateContext();

  const Component = useMemo(() => COMPONENT_MAP[currentTab], [currentTab]);

  const boxRef = useRef(null);

  useEffect(() => {
    boxRef?.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentTab]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  return (
    <div className="find-password-form" ref={boxRef}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </div>
  );
};

export const FindPasswordContent = () => (
  <div className="find-password">
    <p className="find-password__tit">비밀번호 찾기</p>
    <Tabs />
    <ActiveComponent />
  </div>
);

export default FindPasswordContent;

import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';

import {
  Tabs,
  useTabsStateContext,
  useFindAccountStateContext,
  useFindAccountActionContext,
} from '@shopby/react-components';

import FullModal from '../../components/FullModal';

import FindIdResult from './FindIdResult';

const COMPONENT_MAP = {
  EMAIL: lazy(() => import('./FindIdEmailForm')),
  SMS: lazy(() => import('./FindIdSmsForm')),
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
    <div className="find-id-form" ref={boxRef}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </div>
  );
};

export const FindIdContent = () => {
  const { isFindIdFullModalOpen } = useFindAccountStateContext();
  const { setIsFindIdFullModalOpen } = useFindAccountActionContext();

  return (
    <div className="find-id">
      <p className="find-id__tit">아이디 찾기</p>
      <Tabs />
      <ActiveComponent />

      {isFindIdFullModalOpen && (
        <FullModal title="아이디 찾기 결과" onClose={() => setIsFindIdFullModalOpen(false)}>
          <FindIdResult />
        </FullModal>
      )}
    </div>
  );
};

export default FindIdContent;

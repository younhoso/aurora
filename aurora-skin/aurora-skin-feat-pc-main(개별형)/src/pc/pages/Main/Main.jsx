import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { ProductSectionProvider, usePageScriptsActionContext } from '@shopby/react-components';

import MainContents from './MainContents';
import useLayoutChanger from '../../../hooks/useLayoutChanger';

const Main = () => {
  const { applyPageScripts } = usePageScriptsActionContext();
  const platformType = useOutletContext();

  useLayoutChanger({ isMain: true, hasBottomNav: true });

  useEffect(() => {
    applyPageScripts('MAIN');
  }, []);

  return (
    <ProductSectionProvider platformType={platformType}>
      <MainContents platformType={platformType} />
    </ProductSectionProvider>
  );
};

export default Main;

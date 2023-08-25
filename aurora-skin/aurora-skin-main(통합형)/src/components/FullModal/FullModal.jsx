import { useEffect, useLayoutEffect } from 'react';

import { string } from 'prop-types';

import { useAuthStateContext, usePageScriptsActionContext } from '@shopby/react-components';

import { platformType } from '../../utils';
import TitleModal from '../TitleModal';

const FullModal = ({ className, ...props }) => {
  const { removePageScriptElements, applyPageScripts } = usePageScriptsActionContext();
  const { profile } = useAuthStateContext();

  useLayoutEffect(() => {
    removePageScriptElements();
  }, []);

  useEffect(() => {
    applyPageScripts('COMMON', {
      getPlatform: () => platformType,
      profile,
    });
    applyPageScripts('COMMON_HEAD');
    applyPageScripts('COMMON_FOOTER');
  }, []);

  return <TitleModal className={`full-modal ${className ?? ''}`} {...props} isFull={true} />;
};

FullModal.propTypes = {
  className: string,
};

export default FullModal;

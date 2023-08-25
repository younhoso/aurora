import { useContext, useMemo, useState, createContext, useEffect } from 'react';

import { oneOfType, node, element } from 'prop-types';
import { useMallStateContext } from '@shopby/react-components';
import { getRedirectUri, goTo } from '../../utils';

export const LAYOUT_DEFAULT_STATE = {
  isMain: false,
  hasBackBtnOnHeader: false,
  hasHomeBtnOnHeader: false,
  hasCartBtnOnHeader: false,
  hasSearchKeywordHeader: false,
  hasCancelBtnOnHeader: false,
  hasBottomNav: false,
  title: '',
};

const LayoutActionContext = createContext(null);
const LayoutValueContext = createContext(null);

const LayoutProvider = ({ children }) => {
  const { mall } = useMallStateContext();

  const [layoutStatus, setLayoutStatus] = useState(LAYOUT_DEFAULT_STATE);
  const action = useMemo(
    () => ({
      changeLayoutStatus: (layoutStatus) =>
        setLayoutStatus({
          ...LAYOUT_DEFAULT_STATE,
          ...layoutStatus,
        }),
    }),
    [setLayoutStatus]
  );

  useEffect(() => {
    if (!mall?.url) return;

    goTo(getRedirectUri(mall.url));
  }, [mall?.url]);

  return (
    <LayoutActionContext.Provider value={action}>
      <LayoutValueContext.Provider value={layoutStatus}>{children}</LayoutValueContext.Provider>
    </LayoutActionContext.Provider>
  );
};

export const useLayoutActionContext = () => {
  const context = useContext(LayoutActionContext);
  if (!context) throw new Error('INVALID_LayoutActionContext');

  return context;
};

export const useLayoutValueContext = () => {
  const context = useContext(LayoutValueContext);
  if (!context) throw new Error('INVALID_LayoutValueContext');

  return context;
};

export default LayoutProvider;

LayoutProvider.propTypes = {
  children: oneOfType([node, element]).isRequired,
};

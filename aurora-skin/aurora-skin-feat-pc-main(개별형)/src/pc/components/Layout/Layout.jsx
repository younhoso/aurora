import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  BannerProvider,
  Icon,
  OffCanvasProvider,
  usePageScriptsActionContext,
  useAuthStateContext,
  useBoardConfigurationContextAction,
  useShopbyStatisticsRecorder,
  useMallStateContext,
  CartProvider,
} from '@shopby/react-components';
import { PLATFORM_TYPE } from '@shopby/shared';

import useExternalServiceConfig from '../../../hooks/useExternalServiceConfig';
import { scrollToTop } from '../../../utils';
import CategoryNav from '../../../components/CategoryNav';
import DesignPopup from '../../../components/DesignPopup';
import Meta from '../../../components/Meta/Meta';
import LayoutProvider from '../../../components/LayoutProvider';

import Footer from '../Footer';
import { Header, HeaderNav } from '../Header';

const platformType = PLATFORM_TYPE.PC;

const Layout = () => {
  const location = useLocation();
  const { profile, isProfileLoading } = useAuthStateContext();
  const { clientId, mallProfile, externalServiceConfig } = useMallStateContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { fetchBoardConfiguration } = useBoardConfigurationContextAction();
  const { isScriptLoaded, record } = useShopbyStatisticsRecorder({ clientId, mallProfile });
  const { setExternalService } = useExternalServiceConfig();
  const pageRef = useRef();
  const pageInnerRef = useRef();

  useEffect(() => {
    if (isScriptLoaded && !isProfileLoading) {
      record(profile?.memberNo);
    }
  }, [isScriptLoaded, isProfileLoading, location.pathname]);

  useEffect(() => {
    setExternalService(externalServiceConfig);
  }, [location.pathname, externalServiceConfig]);

  useEffect(() => {
    if (isProfileLoading) return;

    applyPageScripts('COMMON', {
      getPlatform: () => PLATFORM_TYPE.PC,
      profile,
    });
    applyPageScripts('COMMON_HEAD');
    applyPageScripts('COMMON_FOOTER');
  }, [profile, isProfileLoading, location]);

  useEffect(() => {
    scrollToTop();
    fetchBoardConfiguration();
  }, []);

  return (
    <LayoutProvider>
      <div className="page" ref={pageRef}>
        <DesignPopup refs={{ pageInnerRef, pageRef }} />
        <BannerProvider>
          <Meta />
          <div className="page-inner" ref={pageInnerRef}>
            <OffCanvasProvider>
              <div className="page__content site">
                <header>
                  <CartProvider>
                    <HeaderNav />
                  </CartProvider>
                  <Header />
                </header>
                <main className="l-content">
                  <Outlet context={platformType} />
                </main>
                <Footer />
                <CategoryNav />
                <span className="fab-top-down">
                  <button className="fab-btn fab-btn--top" onClick={scrollToTop}>
                    <Icon name="angle-down" className="fab-btn__top" />
                    <span className="a11y">페이지 상단으로 가기</span>
                  </button>
                </span>
              </div>
            </OffCanvasProvider>
          </div>
        </BannerProvider>
      </div>
    </LayoutProvider>
  );
};

export default Layout;

Layout.propTypes = {
  isMain: bool,
  hasBottomNav: bool,
  hasHomeBtn: bool,
  hasBackBtn: bool,
  hasCartBtn: bool,
};

import { useEffect, useState, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  BannerProvider,
  Icon,
  OffCanvasProvider,
  SearchAddressProvider,
  usePageScriptsActionContext,
  useAuthStateContext,
  useBoardConfigurationContextAction,
  useShopbyStatisticsRecorder,
  useMallStateContext,
  ProductDetailProvider,
} from '@shopby/react-components';
import { PLATFORM_TYPE } from '@shopby/shared';

import { scrollToTop } from '../../utils';
import AdminBanner from '../AdminBanner';
import BottomNav from '../BottomNav';
import CategoryNav from '../CategoryNav';
import DesignPopup from '../DesignPopup';
import Footer from '../Footer';
import Header from '../Header';
import LayoutProvider, { useLayoutValueContext } from '../LayoutProvider';
import Meta from '../Meta';
import SearchKeyword from '../SearchKeyword';

const platformType = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;

const Layout = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { profile, isProfileLoading } = useAuthStateContext();
  const { clientId, mallProfile } = useMallStateContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { fetchBoardConfiguration } = useBoardConfigurationContextAction();
  const { isScriptLoaded, record } = useShopbyStatisticsRecorder({ clientId, mallProfile });

  const pageRef = useRef();
  const pageInnerRef = useRef();

  const productNo = Number(searchParams.get('productNo'));

  useEffect(() => {
    if (isScriptLoaded && !isProfileLoading) {
      record(profile?.memberNo);
    }
  }, [isScriptLoaded, isProfileLoading, location.pathname]);

  useEffect(() => {
    if (isProfileLoading) return;

    applyPageScripts('COMMON', {
      getPlatform: () => platformType,
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
        {/* area-left */}
        <div className="page__side"></div>
        <BannerProvider>
          <ProductDetailProvider productNo={productNo}>
            <Meta />
            <div className="page-inner" ref={pageInnerRef}>
              {/* banner--left */}
              <article className="page__content banner--left">
                <figure>
                  <AdminBanner bannerId="BNBGLEFT" />
                </figure>
              </article>
              {/* // banner--left */}
              <OffCanvasProvider>
                <div className="page__content site">
                  <Header />
                  <main className="l-content">
                    <Outlet context={platformType} />
                  </main>
                  <Footer />
                  <SearchAddressProvider>
                    <BottomNavWrap />
                  </SearchAddressProvider>
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
          </ProductDetailProvider>
        </BannerProvider>
        {/* area right */}
        <div className="page__side"></div>
      </div>
    </LayoutProvider>
  );
};

const BottomNavWrap = () => {
  const { hasBottomNav } = useLayoutValueContext();
  const [openSearchFullModal, setOpenSearchFullModal] = useState(false);

  if (hasBottomNav)
    return (
      <>
        <BottomNav search={() => setOpenSearchFullModal(true)} />
        {openSearchFullModal && <SearchKeyword openModal={setOpenSearchFullModal} />}
      </>
    );

  return <></>;
};

export default Layout;

Layout.propTypes = {
  isMain: bool,
  hasBottomNav: bool,
  hasHomeBtn: bool,
  hasBackBtn: bool,
  hasCartBtn: bool,
};

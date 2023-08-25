import { oneOf } from 'prop-types';

import { SECTION_CODE } from '@shopby/shared';

import Hero from '../../../pages/Main/Hero';
import AdminBanner from '../../../components/AdminBanner';

import ProductSectionWrap from './ProductSectionWrap';
import RankingSection from './RankingSection';

const MainContents = ({ platformType }) => (
  <div className="main-view">
    <Hero bannerId="BNSLIDE" />
    <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][0]} />
    <div className="banner-image">
      <div className="two-tiered-banner">
        <AdminBanner className="admin-banner" bannerId="BANNER01" />
        <AdminBanner className="admin-banner" bannerId="BANNER02" />
      </div>
    </div>
    <RankingSection />
    <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][2]} />
    <div className="banner-image">
      <div className="two-tiered-banner">
        <AdminBanner className="admin-banner" bannerId="BANNER03" />
        <div>
          <AdminBanner className="admin-banner" bannerId="BANNER04" />
          <AdminBanner className="admin-banner" bannerId="BANNER05" />
        </div>
      </div>
    </div>

    <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][3]} />
    <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][4]} />
    <AdminBanner bannerId="BNBOTTOM" className="banner-image full-width-img" />
  </div>
);

export default MainContents;

MainContents.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
};

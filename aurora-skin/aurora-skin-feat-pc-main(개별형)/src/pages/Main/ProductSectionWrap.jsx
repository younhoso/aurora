import { Link } from 'react-router-dom';

import { cloneDeep } from 'lodash-es';
import { oneOf, string } from 'prop-types';

import { IconSVG, useProductSectionStateContext } from '@shopby/react-components';

import GallerySkeleton from '../../components/GallerySkeleton';
import ProductSectionListRouter from '../../components/ProductSectionListRouter';

const ProductSectionWrap = ({ platformType, sectionsId }) => {
  const { sectionData, isLoading } = useProductSectionStateContext();

  if (isLoading) {
    return (
      <article className="product-section l-panel">
        <GallerySkeleton rowCount={1} colCount={3} isLoading={isLoading} />
      </article>
    );
  }

  const section = sectionData?.get(sectionsId);
  const {
    displayConfig: { displayType, displayWidth, displayHeight },
    label = '',
    products = [],
  } = section ?? { displayConfig: {} };

  if (!products.length) return <></>;
  const sliceProducts = cloneDeep(products).slice(0, displayHeight * displayWidth);

  return (
    <>
      <article className="product-section l-panel">
        <h2 className="product-section__title">{label}</h2>
        <ProductSectionListRouter platformType={platformType} displayType={displayType} products={sliceProducts} />
        <Link className="product-section__more btn" to={`/display/${sectionsId}`}>
          더보기
          <span className="product-section__more-ico">
            <IconSVG name="angle-r" size={20} />
          </span>
        </Link>
      </article>
    </>
  );
};

export default ProductSectionWrap;

ProductSectionWrap.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
  sectionsId: string,
};

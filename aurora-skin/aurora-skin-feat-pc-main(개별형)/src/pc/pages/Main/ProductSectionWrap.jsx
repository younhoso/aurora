import { Link } from 'react-router-dom';

import { cloneDeep } from 'lodash-es';
import { oneOf, string } from 'prop-types';

import { useProductSectionStateContext } from '@shopby/react-components';

import ProductSectionListRouter from '../../components/ProductSectionListRouter';
import GallerySkeleton from '../../../components/GallerySkeleton';

const ProductSectionWrap = ({ sectionsId, section, className, children }) => {
  const { sectionData, isLoading } = useProductSectionStateContext();
  const productSection = section ?? sectionData.get(sectionsId);

  if (isLoading) {
    return (
      <article className="product-section l-panel">
        <GallerySkeleton rowCount={1} colCount={3} isLoading={isLoading} />
      </article>
    );
  }

  if (!productSection?.products) return <></>;

  const {
    displayConfig: { displayType, displayWidth, displayHeight },
    label = '',
    products = [],
  } = productSection ?? { displayConfig: {} };

  const isProductMoveType = displayType === 'PRODUCT_MOVE';

  if (!products.length) return <></>;

  const sliceProducts = cloneDeep(products).slice(0, displayHeight * displayWidth);

  return (
    <>
      <article className={`product-section ${isProductMoveType ? '' : 'pc-content-width'}`}>
        <div className="pc-content-width">
          <p className="product-section__description">{productSection?.sectionExplain}</p>
          <h2 className="product-section__title">{productSection?.title ?? label}</h2>
          <Link className="go-icon" to={`/display/${productSection?.sectionsId ?? sectionsId}`}>
            GO
          </Link>
        </div>
        {children}
        <ProductSectionListRouter
          className={className}
          platformType="PC"
          displayType={displayType}
          products={isProductMoveType ? products : sliceProducts}
        />
      </article>
    </>
  );
};

export default ProductSectionWrap;

ProductSectionWrap.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
  sectionsId: string,
};

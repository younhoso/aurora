import { lazy, Suspense } from 'react';

import { object, string, oneOf, array } from 'prop-types';

import { Skeleton } from '@shopby/react-components';
import { THUMB_LIST_TYPE } from '@shopby/shared';

const LazyProductSliderSection = lazy(() => import('./ThumbSection/ProductSliderSection'));
const LazyProductGrid = lazy(() => import('./ThumbSection/ProductGrid'));

const LoaderSkeletonGallery = () => (
  <div style={{ display: 'flex' }}>
    {Array.from(new Array(3)).map((item, index) => (
      <Skeleton key={index} type={THUMB_LIST_TYPE.GALLERY} />
    ))}
  </div>
);

const LoaderSkeletonList = () => (
  <>
    {Array.from(new Array(5)).map((item, index) => (
      <Skeleton key={index} type={THUMB_LIST_TYPE.LIST} />
    ))}
  </>
);

const LoaderSkeleton = ({ displayType }) =>
  displayType === THUMB_LIST_TYPE.LIST ? <LoaderSkeletonList /> : <LoaderSkeletonGallery />;

const ProductSectionListRouter = ({ platformType, displayType, products, style, className }) => {
  const sectionList = {
    [THUMB_LIST_TYPE.SWIPE]: ({ platformType, products }) => (
      <LazyProductSliderSection
        className={`product-section--slide ${platformType}`}
        spaceBetween={10}
        products={products}
        displayType={displayType}
      />
    ),
    [THUMB_LIST_TYPE.PRODUCT_MOVE]: ({ platformType, products }) => (
      <LazyProductSliderSection
        className={`product-section--slide ${platformType}`}
        spaceBetween={10}
        products={products}
        navigation={false}
        displayType={displayType}
      />
    ),
  };

  return (
    <Suspense fallback={<LoaderSkeleton displayType={displayType} />}>
      {sectionList[displayType]?.({ platformType, displayType, products }) ?? (
        <LazyProductGrid
          className={[platformType, className].join(' ')}
          style={style}
          products={products}
          displayType={displayType}
          platformType={platformType}
        />
      )}
    </Suspense>
  );
};

export default ProductSectionListRouter;

ProductSectionListRouter.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
  displayType: oneOf(['SWIPE', 'GALLERY', 'LIST', 'PRODUCT_MOVE', 'SIMPLE_IMAGE', 'CART']),
  products: array,
  style: object,
  className: string,
};

LoaderSkeleton.propTypes = {
  displayType: oneOf(['SWIPE', 'GALLERY', 'LIST', 'PRODUCT_MOVE', 'SIMPLE_IMAGE', 'CART']),
};

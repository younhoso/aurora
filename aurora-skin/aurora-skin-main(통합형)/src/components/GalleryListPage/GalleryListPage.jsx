import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { object, bool, func, array, number, string } from 'prop-types';

import { Icon, InfiniteScrollLoader, ThumbItem, ThumbList, VisibleComponent } from '@shopby/react-components';
import { calculateDiscountedPrice, THUMB_LIST_TYPE } from '@shopby/shared';

import GallerySkeleton from '../GallerySkeleton';
import ProductThumbBadge from '../ProductThumbBadge';
import ProductThumbInfo from '../ProductThumbInfo';
import TotalCountAndSort from '../TotalCountAndSort';

const SkeletonComponent = ({ isLoading }) => <GallerySkeleton rowCount={3} colCount={2} isLoading={isLoading} />;
const NoSearchProduct = () => {
  const [searchParams] = useSearchParams();
  const keyword = useMemo(() => searchParams.get('keyword'), []);

  return (
    <>
      {keyword ? (
        <div className="no-search">
          <h3 className="no-search__title">&apos;{keyword}&apos; 에 대한 검색결과가 없습니다.</h3>
          <Icon name="no-items" />
          <p className="no-search__description">
            정확한 검색어를 확인하시고 다시 검색해주세요.
            <br />
            일시적으로 상품이 품절 되었을 수 있습니다.
            <br />
            단어의 철자나 띄어쓰기를 다르게 해보세요.
          </p>
        </div>
      ) : (
        <p className="not-found-product">상품이 존재하지 않습니다.</p>
      )}
    </>
  );
};

const GalleryListPage = ({
  style,
  totalCount,
  products,
  sortType,
  sortBy,
  updateSortType,
  handleIntersect,
  disabled,
  className,
  isLoading = false,
}) => (
  <div className="l-panel">
    <TotalCountAndSort totalCount={totalCount} sortType={sortType} sortBy={sortBy} updateSortType={updateSortType} />

    <VisibleComponent
      shows={products.length > 0}
      TruthyComponent={
        <>
          <ThumbList style={style} displayType={THUMB_LIST_TYPE.GALLERY} className={className}>
            {products.map(
              ({
                productNo,
                adult,
                listImageUrls,
                isSoldOut,
                saleStatusType,
                salePrice,
                promotionText,
                productName,
                immediateDiscountAmt,
                additionalDiscountAmt,
                frontDisplayYn,
              }) =>
                frontDisplayYn && (
                  <ThumbItem
                    key={productNo}
                    resize="220x220"
                    href={`/product-detail?productNo=${productNo}`}
                    src={listImageUrls[0]}
                    adult={adult}
                    alt={productName}
                  >
                    <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />

                    <ProductThumbInfo
                      promotionText={promotionText}
                      productName={productName}
                      salePrice={calculateDiscountedPrice({ salePrice, immediateDiscountAmt, additionalDiscountAmt })}
                    />
                  </ThumbItem>
                )
            )}
          </ThumbList>
          <SkeletonComponent isLoading={isLoading} />
          <InfiniteScrollLoader onIntersect={handleIntersect} disabled={disabled} />
        </>
      }
      FalsyComponent={isLoading ? <SkeletonComponent isLoading={isLoading} /> : <NoSearchProduct />}
    />
  </div>
);

export default GalleryListPage;

SkeletonComponent.propTypes = {
  isLoading: bool,
};
GalleryListPage.propTypes = {
  style: object,
  totalCount: number,
  products: array,
  sortType: string,
  sortBy: array,
  updateSortType: func,
  handleIntersect: func,
  disabled: bool,
  className: string,
  isLoading: bool,
};

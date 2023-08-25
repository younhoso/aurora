import { Slider, Slide, ThumbItem, useProductDetailStateContext, VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import GallerySkeleton from '../../components/GallerySkeleton';

const RelatedProduct = () => {
  const { relatedProducts, isLoading } = useProductDetailStateContext();

  if (isLoading) {
    return (
      <section className="l-panel related-product">
        <p className="related-product__title">관련상품</p>
        <div className="related-product__items">
          <GallerySkeleton isLoading={isLoading} rowCount={1} colCount={3} />
        </div>
      </section>
    );
  }

  return (
    <section className="l-panel related-product">
      <p className="related-product__title">관련상품</p>
      <div className="related-product__items">
        <Slider className="related-product__slider" slidesPerView="auto">
          {relatedProducts.map(
            ({ productNo, productName, discountedPrice, originalPrice, hasOnlyOriginalPrice, ...rest }) => (
              <Slide key={productNo} className="related-product__item">
                <ThumbItem {...rest} href={`/product-detail?productNo=${productNo}`}>
                  <span className="related-product__product-name">{productName}</span>
                  <span className="related-product__price">
                    <strong>{convertToKoreanCurrency(discountedPrice)}원</strong>
                    <VisibleComponent
                      shows={!hasOnlyOriginalPrice}
                      TruthyComponent={<span>{convertToKoreanCurrency(originalPrice)}원</span>}
                    />
                  </span>
                </ThumbItem>
              </Slide>
            )
          )}
        </Slider>
      </div>
    </section>
  );
};

export default RelatedProduct;

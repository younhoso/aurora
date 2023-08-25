import { bool, string, oneOf, number, array, object } from 'prop-types';

import { Slide, Slider, ThumbItem } from '@shopby/react-components';
import { calculateDiscountedPrice, THUMB_LIST_TYPE } from '@shopby/shared';

import ProductThumbBadge from '../../ProductThumbBadge';
import ProductThumbInfo from '../../ProductThumbInfo';

const ProductSliderSection = ({
  displayType,
  navigation = false,
  className,
  slidesPerView = 'auto',
  spaceBetween,
  products,
  sliderOption = {},
}) => (
  <div className={className}>
    <Slider navigation={navigation} slidesPerView={slidesPerView} spaceBetween={spaceBetween} {...sliderOption}>
      {products.map(
        ({
          frontDisplayYn,
          productNo,
          listImageUrls,
          adult,
          productName,
          isSoldOut,
          saleStatusType,
          promotionText,
          salePrice,
          immediateDiscountAmt,
          additionalDiscountAmt,
        }) =>
          frontDisplayYn && (
            <Slide key={productNo}>
              <ThumbItem
                resize="220x220"
                href={`/product-detail?productNo=${productNo}`}
                src={listImageUrls[0]}
                adult={adult}
                alt={productName}
              >
                <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />
                {displayType === THUMB_LIST_TYPE.SIMPLE_IMAGE ? (
                  <a href={`/product-detail?productNo=${productNo}`}>
                    <ProductThumbInfo
                      promotionText={promotionText}
                      productName={productName}
                      salePrice={calculateDiscountedPrice({
                        salePrice,
                        immediateDiscountAmt,
                        additionalDiscountAmt,
                      })}
                    />
                  </a>
                ) : (
                  <ProductThumbInfo
                    promotionText={promotionText}
                    productName={productName}
                    salePrice={calculateDiscountedPrice({
                      salePrice,
                      immediateDiscountAmt,
                      additionalDiscountAmt,
                    })}
                  />
                )}
              </ThumbItem>
            </Slide>
          )
      )}
    </Slider>
  </div>
);

export default ProductSliderSection;

ProductSliderSection.propTypes = {
  navigation: bool,
  className: string,
  slidesPerView: oneOf([number, 'auto']),
  spaceBetween: number,
  products: array,
  displayType: oneOf(['SWIPE', 'GALLERY', 'LIST', 'PRODUCT_MOVE', 'SIMPLE_IMAGE', 'CART']),
  sliderOption: object,
};

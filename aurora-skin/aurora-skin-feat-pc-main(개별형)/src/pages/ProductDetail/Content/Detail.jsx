import { useState, useMemo, useRef, useEffect } from 'react';

import { useProductDetailStateContext, useProductOptionStateContext, VisibleComponent } from '@shopby/react-components';

import Sanitized from '../../../components/Sanitized';
import Review from '../Review';

import CertificationInformation from './CertificationInformation';
import DutyInformation from './DutyInformation';

const LIMIT_HEIGHT_TO_SHOW_PRODUCT_DETAIL = 500;

const Detail = () => {
  const productDetailRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [showsMoreBtn, setShowsMoreBtn] = useState(false);

  const {
    productDetail: {
      content: { dutyInfo, ...restContent },
      baseInfo,
    },
  } = useProductDetailStateContext();
  const { originOption } = useProductOptionStateContext();

  const { contents, hasContent } = useMemo(() => {
    const _contents = Object.values(restContent);

    return {
      hasContent: _contents.some(Boolean),
      contents: _contents,
    };
  }, [restContent]);

  const { showsOptionImages, optionImages } = useMemo(() => {
    // 상품 상세 > 등록된 옵션 이미지 사용
    const _showsOptionImages = baseInfo?.optionImageViewable;
    const _optionImages = (originOption?.flatOptions ?? [])?.flatMap(({ images }) => images.filter(({ main }) => main));

    return {
      showsOptionImages: _showsOptionImages,
      optionImages: _optionImages,
    };
  }, [baseInfo?.optionImageViewable, originOption?.flatOptions]);

  const { hasDutyInfo, includesKcInDutyInfo } = useMemo(
    () => ({
      hasDutyInfo: dutyInfo.contents.length > 0,
      includesKcInDutyInfo: dutyInfo.contents?.some(({ label }) => label.startsWith('KC')),
    }),
    [dutyInfo]
  );

  useEffect(() => {
    const productDetailElement = productDetailRef?.current;

    const observer = new ResizeObserver(() => {
      const offsetHeight = productDetailElement?.offsetHeight;
      setShowsMoreBtn(offsetHeight >= LIMIT_HEIGHT_TO_SHOW_PRODUCT_DETAIL);
    });

    observer.observe(productDetailElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={productDetailRef} className={`editor product-content__content ${isOpen ? '' : 'hidden'}`}>
        <div className="product-content__content-box">
          <VisibleComponent
            shows={hasContent || showsOptionImages}
            TruthyComponent={<p className="product-content__title">상품상세정보</p>}
          />
          <VisibleComponent
            shows={showsOptionImages}
            TruthyComponent={
              <div>
                {optionImages?.map((image, index) => (
                  <div key={`option-main-image-${index}`}>
                    <img src={image.url} />
                  </div>
                ))}
              </div>
            }
            FalsyComponent={
              <div>
                {contents.map((html, index) => (
                  <Sanitized key={`product-detail-content-${index}`} html={html ?? ''} />
                ))}
              </div>
            }
          />
          <VisibleComponent
            shows={!hasContent && !showsOptionImages}
            TruthyComponent={<p className="product-content__empty-content">등록된 상품 상세 정보가 없습니다.</p>}
          />

          {/* 상품정보제공고시 */}
          <DutyInformation
            hasDutyInfo={hasDutyInfo}
            includesKcInDutyInfo={includesKcInDutyInfo}
            contents={dutyInfo.contents}
            certifications={baseInfo?.certifications}
          />

          {/* 인증정보 */}
          <CertificationInformation
            includesKcInDutyInfo={includesKcInDutyInfo}
            showsOnPageDetail={baseInfo?.certificationType === 'DETAIL_PAGE'}
            certificationInformation={{
              certificationType: baseInfo?.certificationType,
              certifications: baseInfo?.certifications,
            }}
          />

          <VisibleComponent
            shows={showsMoreBtn}
            TruthyComponent={
              <div className="product-content__more-btn">
                <button onClick={() => setIsOpen((prev) => !prev)}>
                  {isOpen ? '상세정보 접기' : '상세정보 펼쳐보기'}
                </button>
              </div>
            }
          />
        </div>
      </div>
      <Review />
    </>
  );
};

export default Detail;

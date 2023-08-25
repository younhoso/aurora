import { useCallback, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { debounce } from 'lodash-es';

import {
  Button,
  VisibleComponent,
  useCouponByProductActionContext,
  useCouponByProductStateContext,
  useModalActionContext,
  useProductDetailStateContext,
} from '@shopby/react-components';
import { CLIENT_ERROR, isSignedIn, CLIENT_ERROR_MESSAGE } from '@shopby/shared';

import CouponList from '../../../components/CouponList';
import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import { COUPON_DOWNLOAD_BUTTON_DEBOUNCE_TIME } from '../../../constants/debounceTime';

const COUPON_DISPLAY_STATUS = {
  ISSUABLE: {
    theme: 'caution',
    disabled: false,
  },
  UN_ISSUABLE: {
    theme: 'dark',
    disabled: true,
  },
};

const DownloadCouponButton = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const [visibleCouponModal, setVisibleCouponModal] = useState(false);
  const [shouldPreventDoubleDownload, setShouldPreventDoubleDownload] = useState(false);
  const [allIssued, setAllIssued] = useState(false);

  const {
    productDetail: { baseInfo },
  } = useProductDetailStateContext();
  const { coupons, issuedCouponNos } = useCouponByProductStateContext();
  const { openAlert } = useModalActionContext();
  const { fetchIssuableCouponsByProductNo, downloadCouponsByProductNo } = useCouponByProductActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const downloadAllButtonInformation = useMemo(() => {
    const hasCoupons = coupons?.length > 0;

    if (coupons?.every((coupon) => !coupon.downloadable)) return COUPON_DISPLAY_STATUS.UN_ISSUABLE;

    return hasCoupons ? COUPON_DISPLAY_STATUS.ISSUABLE : COUPON_DISPLAY_STATUS.UN_ISSUABLE;
  }, [coupons]);

  const handleCouponModalClick = async () => {
    try {
      if (isSignedIn()) {
        await fetchIssuableCouponsByProductNo({
          includesCartCoupon: true,
          channelType,
        });

        setVisibleCouponModal((prev) => !prev);
      } else {
        openAlert({
          message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR.NO_AUTHORIZATION],
          onClose: () => {
            navigate('/sign-in', {
              replace: true,
              state: {
                from: `${location.pathname}${location.search}`,
              },
            });
          },
        });
      }
    } catch (e) {
      catchError(e);
    }
  };

  const fetchCoupons = () => {
    setShouldPreventDoubleDownload(false);

    fetchIssuableCouponsByProductNo({
      includesCartCoupon: true,
      channelType,
    });
  };

  const handleDownloadCouponsBtnClick = debounce(
    useCallback(async () => {
      if (shouldPreventDoubleDownload) return;

      setShouldPreventDoubleDownload(true);

      try {
        const {
          data: { issuedCoupons },
        } = await downloadCouponsByProductNo({ productNo, includesCartCoupon: true, channelType });

        const issued = issuedCoupons.length > 0;

        if (!issued) {
          openAlert({
            message: '발급 가능한 쿠폰이 없습니다.',
          });
        }

        setAllIssued(issued);
        fetchCoupons();
      } catch (e) {
        const message = e?.error?.serverError?.message;

        if (message) {
          await openAlert({
            message,
          });
        }

        fetchCoupons();
      }
    }, [productNo]),
    COUPON_DOWNLOAD_BUTTON_DEBOUNCE_TIME
  );

  const closeCouponModal = () => {
    fetchCoupons();
    setVisibleCouponModal(false);
    setAllIssued(false);
  };

  return (
    <VisibleComponent
      shows={baseInfo?.couponUseYn === 'N'}
      TruthyComponent={<p className="product-summary__coupon-unissuable">쿠폰사용 불가</p>}
      FalsyComponent={
        <>
          <button type="button" className="product-summary__coupon-download-btn" onClick={handleCouponModalClick}>
            쿠폰 받기
            <span className="ico ico--download-white"></span>
          </button>
          <VisibleComponent
            shows={visibleCouponModal}
            TruthyComponent={
              <FullModal title="쿠폰 받기" onClose={closeCouponModal}>
                <CouponList allIssued={allIssued} channelType={channelType} />
                <Button
                  className={`coupons__download-btn ${downloadAllButtonInformation.disabled && 'disabled'}`}
                  label="쿠폰 한번에 받기"
                  {...downloadAllButtonInformation}
                  onClick={() => handleDownloadCouponsBtnClick(coupons, issuedCouponNos)}
                />
              </FullModal>
            }
          />
        </>
      }
    />
  );
};
export default DownloadCouponButton;

import { useEffect, useRef, useState } from 'react';

import {
  InfiniteScrollLoader,
  ThumbList,
  VisibleComponent,
  useInfiniteScroll,
  useMallStateContext,
  useModalActionContext,
  useProductInquiryFormActionContext,
  useProductInquiryFormStateContext,
  useProductInquiryStateContext,
  useProfileProductInquiryActionContext,
  useProfileProductInquiryStateContext,
} from '@shopby/react-components';

import { BoardFormModification } from '../../../components/Board';
import BoardNoticeList from '../../../components/BoardNoticeList/BoardNoticeList';
import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import ProductThumbItem from '../../../components/ProductThumbItem/ProductThumbItem';
import TotalCount from '../TotalCount';

import ProductInquiryList from './ProductInquiryList';

const ProductInquiryTotalCount = () => {
  const {
    profileProductInquiry: { totalCount },
  } = useProfileProductInquiryStateContext();

  return <TotalCount title="전체 문의" count={totalCount} />;
};

const ProductInquiryContent = () => {
  const formRef = useRef();

  // state
  const { productInquiryTypes } = useMallStateContext();
  const {
    profileProductInquiry: { totalCount },
  } = useProfileProductInquiryStateContext();
  const { inquiryDetail } = useProductInquiryFormStateContext();
  const { inquiryConfig } = useProductInquiryStateContext();

  // action
  const { catchError } = useErrorBoundaryActionContext();
  const { fetchProfileProductInquiries } = useProfileProductInquiryActionContext();
  const { fetchProductInquiryBy, deleteProductInquiryBy, putProductInquiryBy } = useProductInquiryFormActionContext();
  const { openConfirm, openAlert } = useModalActionContext();

  // 수정 모달
  const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (param) => {
      const { data } = await fetchProfileProductInquiries(param);

      return data.items;
    },
  });

  const resetInquiries = () => {
    fetchInitialItems();
  };

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  const handleModifyButtonClick = async ({ inquiryNo, productNo }) => {
    try {
      await fetchProductInquiryBy({
        inquiryNo,
        productNo,
      });

      setIsModificationModalOpen(true);
    } catch (e) {
      catchError(e);
    }
  };

  const handleDeleteButtonClick = ({ inquiryNo }) => {
    openConfirm({
      message: (
        <>
          삭제 시 복구가 불가능합니다. <br />
          정말 삭제하시겠습니까?
        </>
      ),
      onConfirm: async () => {
        try {
          await deleteProductInquiryBy({
            inquiryNo,
          });
          await resetInquiries();
        } catch (e) {
          catchError(e);
        }
      },
      confirmLabel: '삭제',
    });
  };

  const handleFormModify = async () => {
    const { type, title, content, checkboxValues } = formRef.current.formData;

    try {
      await putProductInquiryBy({
        inquiryNo: inquiryDetail.inquiryNo,
        type,
        title,
        content,
        isSecreted: checkboxValues.at(0).checked,
      });

      await openAlert({
        message: '상품문의가 수정되었습니다.',
        onClose: async () => {
          await resetInquiries();

          setIsModificationModalOpen(false);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    resetInquiries();
  }, []);

  return (
    <div className="profile-list">
      <ProductInquiryTotalCount />
      <ProductInquiryList
        items={accumulativeItems}
        onModify={handleModifyButtonClick}
        onDelete={handleDeleteButtonClick}
        isLoading={isLoading}
      />
      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
      />
      <VisibleComponent
        shows={isModificationModalOpen}
        TruthyComponent={
          <FullModal
            title={inquiryConfig.name}
            onClose={() => {
              setIsModificationModalOpen(false);
            }}
          >
            <ThumbList className="l-panel board-form__product-thumb-list">
              <ProductThumbItem
                productName={inquiryDetail.productName}
                brandName={inquiryDetail.brandName}
                imageUrl={inquiryDetail.imageUrl}
              />
            </ThumbList>
            <BoardFormModification
              ref={formRef}
              className="profile-list"
              titleOption={{
                value: inquiryDetail.title,
              }}
              textOption={{
                value: inquiryDetail.content,
                placeholder: '문의 내용을 입력하세요.',
              }}
              typeSelectorOption={{
                value: inquiryDetail.type,
                options: productInquiryTypes,
              }}
              checkboxOption={{
                options: [{ checked: inquiryDetail.secreted, label: '비밀글 설정', value: 'IS_SECRET' }],
              }}
              onModify={handleFormModify}
              onCancel={() => {
                setIsModificationModalOpen(false);
              }}
            />
            <BoardNoticeList
              texts={['성격에 맞지 않는 글, 비방성글, 음란글, 욕설 등은 통보 없이 이동 또는 삭제 될 수 있습니다.']}
            />
          </FullModal>
        }
      />
    </div>
  );
};

export default ProductInquiryContent;

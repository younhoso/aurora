import { useState, useEffect } from 'react';

import { func, arrayOf, shape, number, string, bool, array } from 'prop-types';

import {
  Button,
  VisibleComponent,
  useModalActionContext,
  useProductInquiryFormActionContext,
  useProductInquiryStateContext,
} from '@shopby/react-components';

import { InquiryItem } from '../Board';
import { useErrorBoundaryActionContext } from '../ErrorBoundary';
import FullModal from '../FullModal/FullModal';
import ListSkeleton from '../ListSkeleton/ListSkeleton';
import ProductInquiryForm from '../ProductInquiryForm/ProductInquiryForm';

const EmptyInquiryList = () => (
  <div className="product-board-list__empty">
    <span className="ico ico--exclamation-white-bg"></span>
    <span className="product-board-list__empty-notes">아직 등록된 상품 Q&A가 없어요.</span>
  </div>
);

EmptyInquiryList.displayName = 'EmptyInquiryList';

const DEFAULT_INQUIRY_DETAIL = {
  productName: '',
  productImageUrl: '',
  type: 'PRODUCT',
  title: '',
  content: '',
  isSecreted: false,
};

const ProductInquiryList = ({
  productName = '',
  mainImageUrl = '',
  totalCount,
  onModify,
  onDelete,
  inquiries,
  isLoading,
}) => {
  const { inquiryConfig } = useProductInquiryStateContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { deleteProductInquiryBy, putProductInquiryBy } = useProductInquiryFormActionContext();

  const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);
  const [inquiryDetail, setInquiryDetail] = useState({ ...DEFAULT_INQUIRY_DETAIL });

  const resetInquiryDetail = () => {
    setInquiryDetail({ ...DEFAULT_INQUIRY_DETAIL });

    setIsModificationModalOpen(false);
  };

  const handleDeleteButtonClick = async ({ inquiryNo }) => {
    try {
      await openConfirm({
        message: (
          <>
            삭제 시 복구가 불가능합니다. <br />
            정말 삭제하시겠습니까?
          </>
        ),
        onConfirm: async () => {
          await deleteProductInquiryBy({
            inquiryNo,
          });

          await onDelete();

          resetInquiryDetail();
        },
        confirmLabel: '삭제',
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleModifyButtonClick = (inquiryDetail) => {
    setInquiryDetail(() => ({
      ...inquiryDetail,
      productImageUrl: mainImageUrl,
    }));

    setIsModificationModalOpen(true);
  };

  const handleProductInquiryFormModify = async (form) => {
    try {
      await putProductInquiryBy({
        inquiryNo: inquiryDetail.inquiryNo,
        ...form,
      });

      await openAlert({
        message: '상품문의가 수정되었습니다.',
        onClose: async () => {
          await onModify();

          resetInquiryDetail();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    setInquiryDetail((prev) => ({
      ...prev,
      productName,
      productImageUrl: mainImageUrl,
    }));
  }, [productName, mainImageUrl]);

  return (
    <>
      <div className="product-board-list">
        <div className="product-board-list__search">
          <p>
            문의전체{' '}
            <span className="product-board-list__total-count">
              <em>{totalCount}</em>건
            </span>
          </p>
        </div>
        <VisibleComponent
          shows={totalCount > 0}
          TruthyComponent={
            <>
              <div className="product-board-list__items">
                <ul>
                  {inquiries.map((inquiry) => (
                    <InquiryItem
                      key={inquiry.inquiryNo}
                      {...inquiry}
                      canModify={inquiry.modifiable}
                      isMine={inquiry.myInquiry}
                      answers={inquiry.answers.map(({ inquiryNo, content, updateYmdt }) => ({
                        no: inquiryNo,
                        content,
                        registerYmdt: updateYmdt,
                      }))}
                      onModify={() => handleModifyButtonClick(inquiry)}
                      onDelete={() => handleDeleteButtonClick(inquiry)}
                    />
                  ))}
                </ul>
              </div>
              <ListSkeleton className="product-board-list__items" isLoading={isLoading} />
            </>
          }
          FalsyComponent={
            isLoading ? (
              <ListSkeleton className="product-board-list__items" isLoading={isLoading} />
            ) : (
              <EmptyInquiryList />
            )
          }
        />
      </div>
      <VisibleComponent
        shows={isModificationModalOpen}
        TruthyComponent={
          <FullModal title={inquiryConfig.name}>
            <ProductInquiryForm
              {...inquiryDetail}
              ButtonGroup={(props) => (
                <div className="board-form__button-group">
                  <Button
                    className="board-form__cancel-btn board-form__btn"
                    theme="dark"
                    label="취소"
                    onClick={() => resetInquiryDetail()}
                  />
                  <Button
                    className="board-form__modify-btn board-form__btn"
                    theme="caution"
                    label="수정"
                    onClick={() => handleProductInquiryFormModify(props)}
                  />
                </div>
              )}
            />
          </FullModal>
        }
      />
    </>
  );
};

export default ProductInquiryList;

ProductInquiryList.propTypes = {
  productNo: number.isRequired,
  totalCount: number.isRequired,
  onModify: func.isRequired,
  onDelete: func.isRequired,
  inquiries: arrayOf(
    shape({
      inquiryNo: number,
      memberId: string,
      modifiable: bool,
      myInquiry: bool,
      isReplied: bool,
      isSecreted: bool,
      registerDate: string,
      title: string,
      content: string,
      answers: array,
    })
  ).isRequired,
  productName: string,
  mainImageUrl: string,
  isLoading: bool,
};

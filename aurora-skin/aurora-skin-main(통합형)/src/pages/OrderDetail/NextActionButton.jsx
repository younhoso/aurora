import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { oneOfType, string, number, func, bool } from 'prop-types';

import {
  Button,
  useClaimActionContext,
  useModalActionContext,
  useMyOrderActionContext,
  VisibleComponent,
  ProductReviewFormProvider,
  ProductReviewProvider,
} from '@shopby/react-components';

import FullModal from '../../components/FullModal/FullModal';
import ReviewForm from '../../components/ReviewForm';
import { convertBooleanToYorN } from '../../utils';

const ReviewFormModal = ({ isOpen, onClose, ...props }) => {
  const handleSubmit = () => {
    onClose();
  };

  return (
    <VisibleComponent
      shows={isOpen}
      TruthyComponent={
        <FullModal title="상품후기">
          <ReviewForm isRegisterMode={true} onSubmit={handleSubmit} onCancel={onClose} {...props} />
        </FullModal>
      }
    />
  );
};

ReviewFormModal.propTypes = {
  isOpen: bool,
  onClose: func,
};

const NextActionButton = ({
  orderStatusType,
  nextActionType,
  trackingDeliveryUri,
  productNo,
  optionNo,
  orderOptionNo,
  orderNo,
  className,
  productName,
  productImageUrl,
  optionName,
  optionValue,
  deliverable = true,
  pgType = '',
}) => {
  const navigate = useNavigate();
  const { openAlert, openConfirm } = useModalActionContext();

  const { withdrawClaimByOrderOptionNo, cancelOrder } = useClaimActionContext();
  const { confirmOrder, fetchOrderDetail } = useMyOrderActionContext();

  const [isOpen, setIsOpen] = useState(false);

  const nextAction = {
    CANCEL_ALL: {
      label: '전체 주문 취소',
      execute: () => {
        openConfirm({
          message: '전체 주문을 취소하시겠습니까?',
          onConfirm: async () => {
            await cancelOrder(orderNo);
            openAlert({
              message: '전체 주문 취소가 완료되었습니다.',
              onClose: () => fetchOrderDetail(orderNo),
            });
          },
        });
      },
    },
    CANCEL: {
      label: '취소 신청',
      execute: () => {
        navigate(`/claim/${orderOptionNo}?claimType=CANCEL`);
      },
    },
    EXCHANGE: {
      label: '교환 신청',
      execute: () => {
        navigate(`/claim/${orderOptionNo}?claimType=EXCHANGE`);
      },
    },
    RETURN: {
      label: '반품 신청',
      execute: () => {
        navigate(`/claim/${orderOptionNo}?claimType=RETURN&deliverable=${convertBooleanToYorN(deliverable)}`);
      },
    },
    WITHDRAW_CANCEL: {
      label: '취소신청 철회',
      execute: () => {
        openConfirm({
          message: '취소 신청을 철회하시겠습니까?',
          onConfirm: async () => {
            await withdrawClaimByOrderOptionNo(orderOptionNo.toString());
            openAlert({
              message: '취소신청 철회가 완료되었습니다.',
              onClose: () => fetchOrderDetail(orderNo),
            });
          },
        });
      },
    },
    WITHDRAW_EXCHANGE: {
      label: '교환 취소',
      execute: () => {
        openConfirm({
          message: '교환 신청을 철회하시겠습니까?',
          onConfirm: async () => {
            await withdrawClaimByOrderOptionNo(orderOptionNo.toString());
            openAlert({
              message: '교환 신청 철회가 완료되었습니다.',
              onClose: () => fetchOrderDetail(orderNo),
            });
          },
        });
      },
    },
    WITHDRAW_RETURN: {
      label: '반품 취소',
      execute: () => {
        openConfirm({
          message: '반품 신청을 철회하시겠습니까?',
          onConfirm: async () => {
            await withdrawClaimByOrderOptionNo(orderOptionNo.toString());
            openAlert({
              message: '반품 신청 철회가 완료되었습니다.',
              onClose: () => fetchOrderDetail(orderNo),
            });
          },
        });
      },
    },
    VIEW_DELIVERY: {
      label: '배송 조회',
      execute: () => {
        window.open(trackingDeliveryUri, '_blank');
      },
    },
    CONFIRM_ORDER: {
      label: '구매 확정',
      execute: async () => {
        await confirmOrder(orderOptionNo.toString());
        openAlert({
          message: '구매확정 처리되었습니다.',
          onClose: () => fetchOrderDetail(orderNo),
        });
      },
    },
    WRITE_REVIEW: {
      label: '후기 작성',
      execute: () => {
        if (orderStatusType !== 'BUY_CONFIRM' && pgType?.includes('NAVER')) {
          openAlert({
            message: '네이버페이 주문은 네이버페이에서 구매확정 이후 후기작성이 가능합니다.',
          });

          return;
        }

        setIsOpen(true);
      },
    },
    // 현 스펙 제외
    // CHANGE_ADDRESS: {
    //   label: '',
    //   execute: () => {

    //   }
    // VIEW_CLAIM: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
    // },
    // ISSUE_CASH_RECEIPT: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
    // VIEW_RECEIPT: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
    // DELIVERY_DONE: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
  };

  return (
    <>
      <Button className={className} onClick={() => nextAction[nextActionType]?.execute()}>
        {nextAction[nextActionType].label}
      </Button>
      <ProductReviewFormProvider>
        <ProductReviewProvider productNo={productNo}>
          <ReviewFormModal
            isOpen={isOpen}
            productNo={productNo}
            productName={productName}
            productImageUrl={productImageUrl}
            optionNo={optionNo}
            orderOptionNo={orderOptionNo}
            orderProductOptionNo={optionNo}
            optionName={optionName}
            optionValue={optionValue}
            orderStatusType={orderStatusType}
            onClose={() => {
              setIsOpen(false);
              fetchOrderDetail(orderNo);
            }}
          />
        </ProductReviewProvider>
      </ProductReviewFormProvider>
    </>
  );
};

export default NextActionButton;

NextActionButton.propTypes = {
  nextActionType: oneOfType([
    'CANCEL_ALL',
    'CANCEL',
    'EXCHANGE',
    'RETURN',
    'WITHDRAW_CANCEL',
    'WITHDRAW_EXCHANGE',
    'WITHDRAW_RETURN',
    'VIEW_DELIVERY',
    'CONFIRM_ORDER',
    'WRITE_REVIEW',
    // 현 스펙 제외
    // 'VIEW_CLAIM',
    // 'DELIVERY_DONE',
    // 'CHANGE_ADDRESS',
    // 'ISSUE_CASH_RECEIPT',
    // 'VIEW_RECEIPT'
  ]),
  orderStatusType: string,
  trackingDeliveryUri: string,
  productNo: number,
  orderOptionNo: number,
  orderNo: string,
  className: string,
  productName: string,
  productImageUrl: string,
  optionNo: number,
  optionName: string,
  optionValue: string,
  deliverable: bool,
  pgType: string,
};

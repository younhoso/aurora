import { useEffect, useRef, useState, useMemo } from 'react';

import {
  InquiryProvider,
  InquiryFormProvider,
  useInquiryActionContext,
  useInquiryStateContext,
  useMallStateContext,
  ImageFileProvider,
  VisibleComponent,
  InfiniteScrollLoader,
  useInquiryFormActionContext,
  useModalActionContext,
  Button,
  useInquiryFormStateContext,
  useInfiniteScroll,
  useBoardConfigurationContextAction,
} from '@shopby/react-components';

import { BoardFormModification, BoardFormRegistration } from '../../../components/Board';
import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import { PERSONAL_INQUIRY_IMAGE } from '../../../constants/image';
import useLayoutChanger from '../../../hooks/useLayoutChanger';
import TotalCount from '../TotalCount';

import PersonalInquiryList from './PersonalInquiryList';
const EmptyPersonalInquiryList = () => (
  <div className="inquiry-list__empty">
    <span className="ico ico--exclamation-white-bg"></span>
    <span className="product-board-list__empty-notes">아직 등록된 1:1 문의가 없어요.</span>
  </div>
);
const PersonalInquiryContent = () => {
  const formRef = useRef();

  // state
  const {
    inquiry: { totalCount },
  } = useInquiryStateContext();
  const { inquiryTypes = [] } = useMallStateContext();
  const { inquiryDetail } = useInquiryFormStateContext();
  const { inquiryConfiguration } = useInquiryStateContext();

  // action
  const { openConfirm, openAlert } = useModalActionContext();
  const { fetchInquiries, fetchInquiryConfiguration } = useInquiryActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { postInquiry, putInquiryByInquiryNo, deleteInquiryByInquiryNo, fetchInquiryBy } =
    useInquiryFormActionContext();

  // 등록/수정 모달
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);

  // 문의 유형 옵션
  const inquiryTypeSelectOptions = useMemo(
    () =>
      inquiryTypes.map(({ inquiryTypeNo, inquiryTypeName }) => ({
        label: inquiryTypeName,
        value: `${inquiryTypeNo}`,
      })),
    [inquiryTypes]
  );

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (payload) => {
      const { data } = await fetchInquiries(payload);

      return data.items.map((item) => ({
        ...item,
        images: item.imageUrls.map((imageUrl, index) => ({
          imageUrl,
          originName: item.originalImageUrls[index],
        })),
      }));
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

  const handleModifyButtonClick = async ({ inquiryNo }) => {
    try {
      await fetchInquiryBy({
        inquiryNo,
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
          await deleteInquiryByInquiryNo({
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

  const handleFormSubmit = async () => {
    const { type, title, content, images } = formRef.current.formData;

    try {
      await postInquiry({
        inquiryTypeNo: type,
        inquiryTitle: title,
        inquiryContent: content,
        originalFileName: images.map(({ originName }) => originName),
        uploadedFileName: images.map(({ imageUrl }) => imageUrl),
        usesEmailNotificationWhenRegisteringAnswer: false,
        usesSmsNotificationWhenRegisteringAnswer: false,
      });

      openAlert({
        message: '게시글이 저장되었습니다.',
        onClose: async () => {
          await resetInquiries();

          setIsRegistrationModalOpen(false);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleFormModify = async () => {
    const { title, content, images } = formRef.current.formData;

    try {
      await putInquiryByInquiryNo({
        inquiryNo: inquiryDetail.inquiryNo,
        inquiryTitle: title,
        inquiryContent: content,
        originalFileName: images.map(({ originName }) => originName),
        uploadedFileName: images.map(({ imageUrl }) => imageUrl),
        usesEmailNotificationWhenRegisteringAnswer: inquiryDetail.usesEmailNotificationWhenRegisteringAnswer,
        usesSmsNotificationWhenRegisteringAnswer: inquiryDetail.usesSmsNotificationWhenRegisteringAnswer,
      });

      openAlert({
        message: '게시글이 수정되었습니다.',
        onClose: async () => {
          await resetInquiries();

          setIsModificationModalOpen(false);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: `${inquiryConfiguration?.name ?? '1:1문의'} 관리`,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  useEffect(() => {
    resetInquiries();
    fetchInquiryConfiguration();
  }, []);

  return (
    <div className="personal-inquiry">
      <TotalCount title={inquiryConfiguration?.name ?? '1:1문의'} count={totalCount} />
      <Button
        className="personal-inquiry__registration-button"
        label={`${inquiryConfiguration?.name ?? '1:1문의'} 등록하기`}
        onClick={() => setIsRegistrationModalOpen(true)}
      />

      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={
          <>
            <PersonalInquiryList
              items={accumulativeItems}
              onModify={handleModifyButtonClick}
              onDelete={handleDeleteButtonClick}
            />
            <ListSkeleton className="personal-inquiry-list" isLoading={isLoading} />
          </>
        }
        FalsyComponent={
          isLoading ? (
            <ListSkeleton className="personal-inquiry-list" isLoading={isLoading} />
          ) : (
            <EmptyPersonalInquiryList />
          )
        }
      />
      <VisibleComponent
        shows={accumulativeItems.length > 0}
        TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
      />
      <VisibleComponent
        shows={isRegistrationModalOpen}
        TruthyComponent={
          <FullModal title={`${inquiryConfiguration?.name ?? '1:1문의'} 등록`}>
            <BoardFormRegistration
              ref={formRef}
              className="personal-inquiry-form"
              usesTitle={true}
              canAttach={inquiryConfiguration.usesAttachment}
              typeSelectorOption={{
                options: inquiryTypeSelectOptions,
              }}
              textOption={{
                value: '',
                placeholder: '문의 내용을 입력하세요.',
              }}
              imageFileUploadOption={{
                configuration: PERSONAL_INQUIRY_IMAGE,
              }}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsRegistrationModalOpen(false)}
            />
          </FullModal>
        }
      />
      <VisibleComponent
        shows={isModificationModalOpen}
        TruthyComponent={
          <FullModal
            title={`${inquiryConfiguration?.name} 수정`}
            onClose={() => {
              setIsModificationModalOpen(false);
            }}
          >
            <BoardFormModification
              ref={formRef}
              className="personal-inquiry-form"
              canAttach={inquiryConfiguration.usesAttachment}
              typeSelectorOption={{
                value: `${inquiryDetail.inquiryTypeInformation.no}`,
                disabled: true,
                options: inquiryTypeSelectOptions,
              }}
              titleOption={{
                value: inquiryDetail.inquiryTitle,
              }}
              textOption={{
                value: inquiryDetail.inquiryContent,
              }}
              imageFileUploadOption={{
                configuration: PERSONAL_INQUIRY_IMAGE,
                images: inquiryDetail.imageUrls.map((url, index) => ({
                  originName: inquiryDetail.originalImageUrls[index],
                  imageUrl: url,
                })),
              }}
              onModify={handleFormModify}
              onCancel={() => {
                setIsModificationModalOpen(false);
              }}
            />
          </FullModal>
        }
      />
    </div>
  );
};
const PersonalInquiry = () => {
  const { fetchBoardConfiguration } = useBoardConfigurationContextAction();

  useEffect(() => {
    fetchBoardConfiguration();
  }, []);

  return (
    <InquiryProvider>
      <InquiryFormProvider>
        <ImageFileProvider>
          <PersonalInquiryContent />
        </ImageFileProvider>
      </InquiryFormProvider>
    </InquiryProvider>
  );
};
export default PersonalInquiry;

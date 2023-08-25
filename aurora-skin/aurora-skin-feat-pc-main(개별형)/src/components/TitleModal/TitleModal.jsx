import { func, oneOfType, node, element, string, bool } from 'prop-types';

import { CustomModal, IconBtn } from '@shopby/react-components';

const TitleModal = ({ className, title, onClose, children, classModifier, isFull, ...props }) => (
  <CustomModal className={className} {...props}>
    <div
      className={`title-modal${classModifier ? ` title-modal--${classModifier}` : ''}${
        isFull ? ` title-modal--full` : ''
      }`}
    >
      <div className="title-modal__header">
        <h2 className="title-modal__title">{title}</h2>
        {onClose && (
          <IconBtn
            className="title-modal__close-btn"
            iconType="x-black"
            onClick={() => onClose()}
            hiddenLabel={true}
            label="모달 닫기"
          />
        )}
      </div>
      <div className="title-modal__content">{children}</div>
    </div>
  </CustomModal>
);

export default TitleModal;

TitleModal.propTypes = {
  id: string,
  className: string,
  title: string,
  onClose: func,
  children: oneOfType([node, element]),
  classModifier: string,
  isFull: bool,
};

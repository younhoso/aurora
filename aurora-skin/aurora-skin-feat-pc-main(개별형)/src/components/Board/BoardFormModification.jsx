import { forwardRef } from 'react';

import { string, shape, arrayOf, number, bool, func } from 'prop-types';

import { Button } from '@shopby/react-components';

import BoardForm from './BoardForm';

const BoardFormModification = forwardRef(
  ({ className = '', modifyButtonLabel = '수정', cancelButtonLabel = '취소', onModify, onCancel, ...props }, ref) => (
    <BoardForm
      className={`board-form--modification ${className ?? ''}`}
      ref={ref}
      {...props}
      ButtonGroup={() => (
        <>
          <Button theme="caution" label={modifyButtonLabel} onClick={onModify} />
          <Button theme="dark" label={cancelButtonLabel} onClick={onCancel} />
        </>
      )}
    />
  )
);

export default BoardFormModification;

BoardFormModification.displayName = 'BoardFormModification';

BoardFormModification.propTypes = {
  onModify: func.isRequired,
  onCancel: func.isRequired,
  modifyButtonLabel: string,
  cancelButtonLabel: string,
  className: string,
  titleOption: shape({
    value: string,
    onChange: func,
    placeholder: string,
  }),
  textOption: shape({
    value: string,
    onChange: func,
    usesCounter: bool,
    placeholder: string,
  }),
  typeSelectorOption: shape({
    value: string,
    disabled: bool,
    options: arrayOf(
      shape({
        label: string,
        value: string,
      })
    ),
    onSelect: func,
  }),
  checkboxOption: shape({
    title: string,
    options: arrayOf(
      shape({
        checked: bool,
        label: string,
        value: string,
      })
    ),
    onChange: func,
  }),
  rateOption: shape({
    value: number,
    onChange: func,
  }),
  imageFileUploadOption: shape({
    configuration: shape({
      LIMIT_MEGA_BYTES: number,
      LIMIT_COUNT: number,
    }),
    images: arrayOf(
      shape({
        imageUrl: string,
        originName: string,
      })
    ),
    onChange: func,
    onUpload: func,
  }),
};

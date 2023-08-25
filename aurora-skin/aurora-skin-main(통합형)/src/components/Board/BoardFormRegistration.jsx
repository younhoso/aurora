import { forwardRef, useMemo } from 'react';

import { string, shape, arrayOf, number, bool, func } from 'prop-types';

import { Button } from '@shopby/react-components';

import { RATING_STAR } from '../../constants/rate';

import BoardForm from './BoardForm';

const makeInitialState = (initialState, use, option) => {
  if (option) {
    return option;
  }

  if (use) {
    return initialState;
  }

  return option;
};

const BoardFormRegistration = forwardRef(
  (
    {
      className = '',
      usesTitle = false,
      usesText = false,
      usesTextCounter = false,
      usesRate = false,
      submitButtonLabel = '등록',
      onSubmit,
      onCancel,
      titleOption = null,
      textOption = null,
      typeSelectorOption = null,
      rateOption = null,
      imageFileUploadOption = null,
      checkboxOption = null,
      canAttach = true,
    },
    ref
  ) => {
    const _titleOption = useMemo(
      () =>
        makeInitialState(
          {
            value: '',
            placeholder: '제목을 입력하세요.',
          },
          usesTitle,
          titleOption
        ),
      [titleOption]
    );

    const _textOption = useMemo(
      () =>
        makeInitialState(
          {
            value: '',
            usesCounter: usesTextCounter,
          },
          usesText,
          textOption
        ),
      [textOption]
    );

    const _rateOption = useMemo(
      () =>
        makeInitialState(
          {
            value: RATING_STAR.LIMIT_SCORE,
          },
          usesRate,
          rateOption
        ),
      [rateOption]
    );

    return (
      <BoardForm
        className={`board-form--registration ${className ?? ''}`}
        ref={ref}
        ButtonGroup={() => (
          <>
            <Button theme="dark" label="취소" onClick={onCancel} />
            <Button theme="caution" label={submitButtonLabel} onClick={onSubmit} />
          </>
        )}
        titleOption={_titleOption}
        textOption={_textOption}
        typeSelectorOption={typeSelectorOption}
        checkboxOption={checkboxOption}
        rateOption={_rateOption}
        canAttach={canAttach}
        imageFileUploadOption={imageFileUploadOption}
      />
    );
  }
);

export default BoardFormRegistration;

BoardFormRegistration.displayName = 'BoardFormRegistration';

BoardFormRegistration.propTypes = {
  className: string,
  onSubmit: func.isRequired,
  onCancel: func.isRequired,
  submitButtonLabel: string,
  usesTitle: bool,
  usesText: bool,
  usesTextCounter: bool,
  usesRate: bool,
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
    options: arrayOf(
      shape({
        label: string,
        value: string,
      }).isRequired
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
  canAttach: bool,
};

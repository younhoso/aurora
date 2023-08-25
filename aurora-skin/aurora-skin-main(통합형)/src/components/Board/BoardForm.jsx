import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { string, shape, arrayOf, number, bool, func } from 'prop-types';

import { VisibleComponent, SelectBox, CharacterCounter, RatingStar } from '@shopby/react-components';
import { calculateRatingScoreByCurrentWidth } from '@shopby/shared';

import BoardFormCheckboxGroup from './BoardFormCheckboxGroup';
import BoardFormImage from './BoardFormImage';

const BoardForm = forwardRef(
  (
    {
      className = '',
      titleOption = null,
      textOption = null,
      typeSelectorOption = null,
      rateOption = null,
      imageFileUploadOption = null,
      checkboxOption = null,
      ButtonGroup,
      canAttach = true,
    },
    ref
  ) => {
    const titleRef = useRef();
    const rateRef = useRef();
    const textRef = useRef();
    const imageFileUploadRef = useRef();

    const [type, setType] = useState(typeSelectorOption?.value ?? typeSelectorOption?.options?.at(0)?.value);
    const [title, setTitle] = useState(titleOption?.value);
    const [content, setContent] = useState(textOption?.value);
    const [score, setScore] = useState(rateOption?.value);
    const [checkboxValues, setCheckBoxValues] = useState(checkboxOption?.options);
    const [images, setImages] = useState(imageFileUploadOption?.images);

    const handleTypeSelect = useCallback((event) => {
      setType(event.currentTarget.value);

      typeSelectorOption?.onSelect?.(event);
    }, []);

    const handleTitleChange = useCallback(({ character: { value, count } }) => {
      setTitle(value);

      titleOption?.onChange?.({ value, count });
    }, []);

    const handleContentChange = useCallback(({ character: { value, count } }) => {
      setContent(value);

      textOption?.onChange?.({ value, count });
    }, []);

    const handleCheckboxChange = useCallback((event) => {
      const {
        currentTarget: { value, checked },
      } = event;

      setCheckBoxValues((prev) =>
        prev.map((checkboxOption) => {
          if (value === checkboxOption.value) {
            return {
              ...checkboxOption,
              checked,
            };
          }

          return checkboxOption;
        })
      );

      checkboxOption?.onChange?.(event);
    }, []);

    const handleImagesChange = useCallback((selectedImages) => {
      setImages(selectedImages);

      imageFileUploadOption?.onChange?.(selectedImages);
    }, []);

    const handleImageUploadButtonClick = useCallback(() => {
      imageFileUploadRef.current.click();
    }, [imageFileUploadRef?.current]);

    const handleRatingStarClick = useCallback(({ target, nativeEvent: { offsetX } }) => {
      const ratingStarElement = target.getBoundingClientRect();
      const _score = calculateRatingScoreByCurrentWidth({ offsetX, width: ratingStarElement.width });

      setScore(_score);
    }, []);

    const resetFormData = useCallback(() => {
      setType(typeSelectorOption?.value);
      setTitle(titleOption?.value);
      setContent(textOption?.value);
      setScore(rateOption?.value);
      setCheckBoxValues(checkboxOption?.options);
      setImages(imageFileUploadOption?.images);
    }, []);

    useImperativeHandle(ref, () => ({
      /**
       * @param {'type' | 'title' | 'rate' | 'text' | 'optionSelector' | 'secret' | 'attachment'} type
       */
      focus: (type) => {
        `${type}Ref`?.current.focus();
      },
      get formData() {
        return {
          type,
          title,
          rate: score,
          content,
          checkboxValues,
          images: images ?? [],
        };
      },
      resetFormData,
    }));

    return (
      <div className={`board-form l-panel ${className ?? ''}`}>
        <VisibleComponent
          shows={typeSelectorOption && typeSelectorOption?.options?.length > 0}
          TruthyComponent={
            <SelectBox
              className={`board-form__type-selector ${
                typeSelectorOption?.disabled ? 'board-form__type-selector--disabled' : ''
              }`}
              {...typeSelectorOption}
              value={type}
              onSelect={handleTypeSelect}
            />
          }
        />
        <div className="board-form__top">
          <VisibleComponent
            shows={titleOption}
            TruthyComponent={
              <CharacterCounter
                ref={titleRef}
                className="board-form__title"
                limitCount={{
                  character: 50,
                }}
                {...titleOption}
                valid="NO_COMMON_SPECIAL"
                value={title}
                onChange={handleTitleChange}
              />
            }
          />
          <VisibleComponent
            shows={rateOption}
            TruthyComponent={
              <RatingStar
                ref={rateRef}
                className="board-form__rating-star"
                {...rateOption}
                onClick={handleRatingStarClick}
                score={score}
              />
            }
          />
        </div>
        <CharacterCounter
          ref={textRef}
          className="board-form__text"
          limitCount={{
            character: 1000,
          }}
          textType="TEXT_AREA"
          valid="NO_COMMON_SPECIAL"
          {...textOption}
          value={content}
          onChange={handleContentChange}
        />
        <VisibleComponent
          shows={checkboxOption?.options.length > 0}
          TruthyComponent={
            <BoardFormCheckboxGroup {...checkboxOption} options={checkboxValues} onChange={handleCheckboxChange} />
          }
        />
        <VisibleComponent
          shows={imageFileUploadOption}
          TruthyComponent={
            <BoardFormImage
              ref={imageFileUploadRef}
              {...imageFileUploadOption}
              images={images}
              canAttach={canAttach}
              onChange={handleImagesChange}
              onClick={handleImageUploadButtonClick}
            />
          }
        />
        <div className="board-form__buttons">
          <ButtonGroup />
        </div>
      </div>
    );
  }
);

export default BoardForm;

BoardForm.displayName = 'BoardForm';

BoardForm.propTypes = {
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
  ButtonGroup: func,
  canAttach: bool,
};

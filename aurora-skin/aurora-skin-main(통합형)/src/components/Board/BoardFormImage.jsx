import { forwardRef } from 'react';

import { string, shape, arrayOf, number, func, bool } from 'prop-types';

import { Button, VisibleComponent } from '@shopby/react-components';

import { BOARD_IMAGE } from '../../constants/image';
import ImageFileUpload from '../ImageFileUpload';

const BoardFormImage = forwardRef(
  ({ configuration, onClick, images = [], onChange, canAttach = true, ...props }, ref) => {
    const updateImages = (images) => {
      onChange?.(images);
    };

    const handleImagesChange = (selectedImages) => {
      if (!selectedImages.length) return;

      updateImages([...images, ...selectedImages]);
    };

    const handleImageDelete = (imageUrl) => {
      if (!imageUrl) return;

      updateImages(images.filter((image) => image.imageUrl !== imageUrl));
    };

    return (
      <>
        <ul className="board-form__image-files">
          {images.map((image, index) => (
            <li key={index} id={`${index}_${image.originName}`} className="board-form__image">
              <img src={`${image.imageUrl}?${BOARD_IMAGE.THUMB_NAIL_SIZE}`} alt={image.originName} loading="lazy" />
              <button className="delete" onClick={() => handleImageDelete(image.imageUrl)} />
            </li>
          ))}
        </ul>
        <VisibleComponent
          shows={canAttach}
          TruthyComponent={
            <>
              <ImageFileUpload
                className="board-form__file-upload"
                ref={ref}
                {...props}
                images={images}
                onChange={handleImagesChange}
                limitFileSizeInMB={configuration.LIMIT_MEGA_BYTES}
                limitCount={configuration.LIMIT_COUNT}
              />
              <Button className="board-form__upload-btn" label="사진 첨부하기" onClick={onClick} />
              <p className="board-form__notice-text">
                업로드 용량은 {configuration.LIMIT_MEGA_BYTES}MB 이하로만 가능 합니다.
              </p>
            </>
          }
        />
      </>
    );
  }
);

BoardFormImage.displayName = 'BoardFormImage';

BoardFormImage.propTypes = {
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
  onClick: func,
  onChange: func,
  canAttach: bool,
};

export default BoardFormImage;

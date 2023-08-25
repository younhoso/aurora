import { forwardRef } from 'react';

import { func, arrayOf, shape, number, string } from 'prop-types';

import { useImageFileActionContext } from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../ErrorBoundary';

const ImageFileUpload = forwardRef(
  (
    {
      images = [],
      limitCount = Infinity,
      limitFileSizeInMB = Infinity,
      verifyImageFiles,
      onChange,
      accept = 'image/png,image/jpeg,image/gif,image/jpg,image/bmp',
    },
    ref
  ) => {
    const { postImages } = useImageFileActionContext();
    const { catchError } = useErrorBoundaryActionContext();

    const handleInputChange = async (event) => {
      try {
        const { files } = event.target;

        verifyImageFiles?.(files);

        const { data } = await postImages({
          files,
          images,
          limitFileSizeInMegaBytes: limitFileSizeInMB,
          limitCount,
        });

        const fulfilledImages = data.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);

        onChange?.(fulfilledImages);

        ref.current.value = '';
      } catch (e) {
        catchError(e);
      }
    };

    return <input hidden ref={ref} type="file" multiple accept={accept} onChange={handleInputChange} />;
  }
);

ImageFileUpload.displayName = 'ImageFileUpload';

export default ImageFileUpload;

ImageFileUpload.propTypes = {
  images: arrayOf(
    shape({
      imageUrl: string,
      originName: string,
    })
  ),
  onChange: func,
  verifyImageFiles: func,
  limitCount: number,
  limitFileSizeInMB: number,
  accept: string,
};

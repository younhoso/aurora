import { useMemo } from 'react';

import { bool, string, arrayOf, shape } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

const FoldingImagesByOneRow = ({ className = '', isActive = false, images = [] }) => {
  const imageCount = useMemo(() => images.length, [images]);

  const displayImages = useMemo(() => (isActive ? images : [images?.at(0) ?? '']), [images, isActive]) ?? [];

  return (
    <VisibleComponent
      shows={images.length > 0}
      TruthyComponent={
        <div className={`folding-images-by-one-row ${isActive ? 'is-active' : ''} ${className}`}>
          <ul className="folding-images-by-one-row__image-list">
            {displayImages.map(({ src, name }, index) => (
              <li key={`${name}_${index}`}>
                <img src={src} alt={name} />
              </li>
            ))}
          </ul>
          <span className="folding-images-by-one-row__image-count">{imageCount}</span>
        </div>
      }
    />
  );
};

FoldingImagesByOneRow.propTypes = {
  className: string,
  isActive: bool,
  images: arrayOf(
    shape({
      src: string,
      name: string,
    })
  ),
};

export default FoldingImagesByOneRow;

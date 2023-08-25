import { number, node, oneOf, element, string, bool } from 'prop-types';

import { Skeleton } from '@shopby/react-components';
import { THUMB_LIST_TYPE } from '@shopby/shared';

const RowSkeletonGallery = ({ colCount }) => (
  <div style={{ display: 'flex', marginBottom: '10px' }}>
    {Array.from(Array(colCount)).map((_, index) => (
      <Skeleton key={index} type={THUMB_LIST_TYPE.GALLERY} />
    ))}
  </div>
);
const GallerySkeleton = ({ rowCount = 1, colCount = 1, children, className, isLoading }) => {
  if (isLoading) {
    return (
      <div className={className}>
        {Array.from(Array(rowCount)).map((_, index) => (
          <RowSkeletonGallery colCount={colCount} key={index} />
        ))}
      </div>
    );
  }

  return children;
};

export default GallerySkeleton;

RowSkeletonGallery.propTypes = {
  colCount: number,
};
GallerySkeleton.propTypes = {
  className: string,
  rowCount: number,
  colCount: number,
  children: oneOf([node, element]),
  isLoading: bool,
};

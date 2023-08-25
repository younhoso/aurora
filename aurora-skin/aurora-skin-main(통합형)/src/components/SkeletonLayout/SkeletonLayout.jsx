import { range } from 'lodash-es';

import { Skeleton } from '@shopby/react-components';

const DISPLAY_ITEM_COUNT = 5;

const SkeletonLayout = () => (
  <div className="skeleton-wrap">
    <Skeleton type="GALLERY" />
    <div className="skeleton-wrap-list">
      {range(DISPLAY_ITEM_COUNT).map((_, index) => (
        <Skeleton key={index} type="LIST" />
      ))}
    </div>
  </div>
);

export default SkeletonLayout;

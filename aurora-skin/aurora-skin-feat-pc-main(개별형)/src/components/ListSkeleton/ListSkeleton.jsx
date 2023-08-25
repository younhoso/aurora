import { number, node, oneOf, element, string, bool } from 'prop-types';

import { Skeleton } from '@shopby/react-components';

const ListSkeleton = ({ size = 4, children, className, isLoading }) => {
  if (isLoading) {
    return (
      <div className={className}>
        {Array(size)
          .fill(null)
          .map((_, idx) => (
            <Skeleton key={idx} type="LIST" />
          ))}
      </div>
    );
  }

  return children;
};

export default ListSkeleton;

ListSkeleton.propTypes = {
  className: string,
  size: number,
  children: oneOf([node, element]),
  isLoading: bool,
};

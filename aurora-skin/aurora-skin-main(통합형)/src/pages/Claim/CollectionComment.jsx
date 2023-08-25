import { oneOfType, string } from 'prop-types';

import { getCollectionComments } from '../../utils';

const CollectionComment = ({ returnWay, returnWarehouseLabel } = {}) => (
  <div className="claim__section claim__section--no-padding">
    <p className="claim__title">반품 수거 안내</p>
    <ul className="claim__comment">
      {getCollectionComments(returnWay, returnWarehouseLabel).map((comment) => (
        <li key={comment}>{comment}</li>
      ))}
    </ul>
  </div>
);

export default CollectionComment;

CollectionComment.propTypes = {
  returnWay: oneOfType(['BUYER_DIRECT_RETURN', 'SELLER_COLLECT']).isRequired,
  returnWarehouseLabel: string,
};

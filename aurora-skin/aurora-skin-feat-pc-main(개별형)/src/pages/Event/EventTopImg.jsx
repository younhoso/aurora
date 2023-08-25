import { string, shape, oneOf } from 'prop-types';

import CustomBanner from '../../components/CustomBanner';
import Sanitized from '../../components/Sanitized';

const EventTopImg = ({ imgInfo, label }) => {
  const { type, url } = imgInfo;

  return (
    <>
      {url && type === 'FILE' ? (
        <CustomBanner className="event-hero" src={url} alt={label} />
      ) : (
        <Sanitized html={url} />
      )}
    </>
  );
};

export default EventTopImg;

EventTopImg.propTypes = {
  imgInfo: shape({
    type: oneOf(['HTML', 'FILE']),
    url: string,
  }),
  label: string,
};

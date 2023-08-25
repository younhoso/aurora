import { useNavigate } from 'react-router-dom';

import { string, func } from 'prop-types';

import { IconBtn } from '@shopby/react-components';

const BackButton = ({ label, className, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (history.state && history.state.idx === 0) {
      navigate('/');

      return;
    }

    onClick ? onClick() : navigate(-1);
  };

  return <IconBtn label={label} className={className} iconType="arrow-left" onClick={handleClick} />;
};

export default BackButton;

BackButton.propTypes = {
  label: string,
  className: string,
  onClick: func,
};

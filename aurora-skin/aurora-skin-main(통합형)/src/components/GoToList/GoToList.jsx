import { string, func, bool } from 'prop-types';

import { Button, IconSVG } from '@shopby/react-components';

const GoToList = ({ title, onClick, disabled }) => {
  const handleButtonClick = () => {
    if (disabled) return;

    onClick?.();
  };

  return (
    <Button
      className={`go-to-list ${disabled && 'go-to-list--disabled'}`}
      onClick={handleButtonClick}
      disabled={disabled}
    >
      <p className="go-to-list__title">{title}</p>
      <span className="go-to-list__angle-r">
        <IconSVG name="angle-r" fill="transparent" stroke="#3f434c" strokeWidth={8} />
      </span>
    </Button>
  );
};

export default GoToList;

GoToList.propTypes = {
  title: string,
  onClick: func,
  disabled: bool,
};

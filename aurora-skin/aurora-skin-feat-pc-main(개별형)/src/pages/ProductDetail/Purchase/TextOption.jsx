import { forwardRef } from 'react';

import { string, bool } from 'prop-types';

import { CharacterCounter } from '@shopby/react-components';

const TextOption = forwardRef(({ id, value, inputLabel, required, ...props }, ref) => (
  <div className="text-option">
    <span className="text-option__label">
      <span>{inputLabel}</span>
      {required && <em>(필수)</em>}
    </span>
    <CharacterCounter ref={ref} id={id} required={required} className="text-option__input" value={value} {...props} />
  </div>
));

export default TextOption;
TextOption.displayName = 'TextOption';

TextOption.propTypes = {
  id: string,
  value: string,
  inputLabel: string,
  required: bool,
};

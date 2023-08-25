import { string, arrayOf } from 'prop-types';

import { getOptionLabels } from '../../utils';

const OptionLabel = ({ optionName, optionValue, optionInputs }) => {
  const { normalOptionLabels, textOptionLabels } = getOptionLabels({ optionName, optionValue, optionInputs });

  return (
    <div className="option-label">
      <div className="option-label__normal-option">
        {normalOptionLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div>
        {textOptionLabels.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>
    </div>
  );
};

export default OptionLabel;

OptionLabel.propTypes = {
  optionName: string,
  optionValue: string,
  optionInputs: arrayOf(string),
};

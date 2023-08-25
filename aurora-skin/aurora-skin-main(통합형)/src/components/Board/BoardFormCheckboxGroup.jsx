import { string, shape, arrayOf, bool, func } from 'prop-types';

import { Checkbox, VisibleComponent } from '@shopby/react-components';

const BoardFormCheckboxGroup = ({ options, title = '', onChange }) => (
  <div className="board-form__checkbox-group">
    <VisibleComponent shows={title} TruthyComponent={<p className="board-form__checkbox-title">{title}</p>} />
    {options.map((option) => (
      <Checkbox key={option.value} className="board-form__checkbox" {...option} onChange={onChange} />
    ))}
  </div>
);

BoardFormCheckboxGroup.propTypes = {
  title: string,
  options: arrayOf(
    shape({
      checked: bool,
      label: string,
      value: string,
    })
  ),
  onChange: func,
};

export default BoardFormCheckboxGroup;

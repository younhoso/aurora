import { string } from 'prop-types';

import { useSignUpStateContext } from '@shopby/react-components';

const ValidationStatus = ({ name }) => {
  const { validationStatus } = useSignUpStateContext();

  return (
    <p className={`description ${validationStatus[name]?.message && validationStatus[name]?.result ? '' : 'alert'}`}>
      {validationStatus[name].message}
    </p>
  );
};

export default ValidationStatus;
ValidationStatus.propTypes = {
  name: string,
};

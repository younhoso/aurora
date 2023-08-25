import { string } from 'prop-types';

import { useMemberModificationStateContext } from '@shopby/react-components';

const ValidationStatus = ({ name }) => {
  const { validationStatus } = useMemberModificationStateContext();

  return (
    <p className={`description ${validationStatus[name]?.message && validationStatus[name]?.result ? '' : 'alert'}`}>
      {validationStatus[name]?.message}
    </p>
  );
};

export default ValidationStatus;
ValidationStatus.propTypes = {
  name: string,
};

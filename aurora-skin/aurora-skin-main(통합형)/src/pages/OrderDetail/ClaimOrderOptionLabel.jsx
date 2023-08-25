import { useMemo } from 'react';

import { shape, string } from 'prop-types';

import OptionLabel from '../../components/OptionLabel';

const ClaimOrderOptionLabel = ({ claimOrderOption }) => {
  const optionInputs = useMemo(() => {
    if (!claimOrderOption.userInputTextStr) return [];

    return claimOrderOption.userInputTextStr.split('|').map((token) => {
      const [inputLabel, inputValue] = token.split(' : ');

      return { inputLabel, inputValue };
    });
  }, [claimOrderOption.userInputTextStr]);

  return (
    <div>
      <p>
        (수량: {claimOrderOption.orderCnt}개) {claimOrderOption.productName}
      </p>
      <OptionLabel
        optionName={claimOrderOption.optionName}
        optionValue={claimOrderOption.optionValue}
        optionInputs={optionInputs}
      />
    </div>
  );
};

export default ClaimOrderOptionLabel;

ClaimOrderOptionLabel.propTypes = {
  claimOrderOption: shape({
    productName: string,
    optionName: string,
    optionValue: string,
    orderCnt: string,
    useInputTextStr: string,
  }).isRequired,
};

export const getOptionLabels = ({ optionName, optionValue, optionInputs }) => {
  const optionNameTokens = optionName?.split('|') ?? [];
  const optionValueTokens = optionValue?.split('|') ?? [];
  const normalOptionLabels = optionNameTokens.map(
    (optionNameToken, idx) => `${idx + 1}) ${optionNameToken}: ${optionValueTokens[idx]}`
  );
  const textOptionLabels = optionInputs?.map(({ inputLabel, inputValue }) => `${inputLabel}: ${inputValue}`) ?? [];

  return {
    normalOptionLabels,
    textOptionLabels,
  };
};

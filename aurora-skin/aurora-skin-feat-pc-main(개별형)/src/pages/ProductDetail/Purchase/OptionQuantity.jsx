import { useMemo } from 'react';

import {
  useProductOptionActionContext,
  useProductOptionStateContext,
  Quantity,
  VisibleComponent,
} from '@shopby/react-components';

import TextOption from './TextOption';

const OptionQuantity = () => {
  const { quantities, textOptionMapByOption, textOptionsByProduct, flatOptions } = useProductOptionStateContext();
  const { deleteQuantityBy, changeQuantityCount, changeTextOptionByOption, changeTextOptionByProduct } =
    useProductOptionActionContext();

  const hasOnlyOneOption = useMemo(() => flatOptions.length === 1, [flatOptions]);

  return (
    <VisibleComponent
      shows={quantities?.length > 0}
      TruthyComponent={
        <>
          {quantities.map(({ selectedKey, quantity }) => (
            <Quantity
              key={selectedKey}
              className={`${hasOnlyOneOption ? 'undeletable' : ''}`}
              count={quantity?.count}
              onChangeValue={(value) => {
                changeQuantityCount({ selectedKey, count: Number(value) });
              }}
              onDelete={() => {
                deleteQuantityBy(selectedKey);
              }}
              info={{
                id: selectedKey,
                title: quantity?.selectedOptionValues.join(' | '),
                price: quantity?.totalPrice ?? 0,
              }}
            >
              {textOptionMapByOption?.has(selectedKey) &&
                [...textOptionMapByOption.get(selectedKey)].map(({ textOptionKey, inputLabel, required }) => (
                  <TextOption
                    key={textOptionKey}
                    id={textOptionKey}
                    inputLabel={inputLabel}
                    required={required}
                    placeholder={`${inputLabel} (을)를 입력하세요.`}
                    limitCount={{
                      character: 1_000,
                    }}
                    onChange={({ character: { value } }) => {
                      changeTextOptionByOption({
                        selectedOptionKey: selectedKey,
                        textOptionKey,
                        value,
                      });
                    }}
                  />
                ))}
            </Quantity>
          ))}
          {textOptionsByProduct?.map(({ textOptionKey, textOption: { inputLabel, required } }) => (
            <TextOption
              key={textOptionKey}
              id={textOptionKey}
              inputLabel={inputLabel}
              required={required}
              placeholder={`${inputLabel} (을)를 입력하세요.`}
              limitCount={{
                character: 1_000,
              }}
              onChange={({ character: { value } }) => {
                changeTextOptionByProduct({
                  textOptionKey,
                  value,
                });
              }}
            />
          ))}
        </>
      }
    />
  );
};

export default OptionQuantity;

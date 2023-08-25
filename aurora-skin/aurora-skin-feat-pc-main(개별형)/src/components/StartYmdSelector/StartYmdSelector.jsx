import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { string, func, arrayOf, bool } from 'prop-types';

import { SelectBox } from '@shopby/react-components';
import { getDateLabel } from '@shopby/shared';

const convertDateOffsetOptionToSelectBoxOption = (offsetOption) => {
  if (offsetOption === 'td')
    return {
      label: '오늘',
      value: getDateLabel(),
    };

  const regexForOnlyNumber = /[^0-9]/g;
  const typeStringArray = [];

  const offset = Number(
    offsetOption.replace(regexForOnlyNumber, (match) => {
      typeStringArray.push(match);

      return '';
    })
  );

  const type = typeStringArray.join('');

  if (!['y', 'm', 'd'].includes(type)) return null;

  const LABEL_MAP = {
    y: '년',
    m: '개월',
    d: '일',
  };

  const DATE_LABEL_TYPE_MAP = {
    y: 'YEAR',
    m: 'MONTH',
    d: 'DATE',
  };

  return {
    label: `${offset}${LABEL_MAP[type]}`,
    value: getDateLabel(DATE_LABEL_TYPE_MAP[type], -offset),
  };
};

const DEFAULT_START_YMD_QUERY_PARAM_KEY = 'startYmd';
const DEFAULT_OFFSET_OPTIONS = ['td', '7d', '1m', '3m', '1y'];

/**
 * 오늘을 기준으로 오늘, 3일 전, 1개월 전 등의 'startYmd' queryParam를 뽑아내는 컴포넌트입니다.
 * offsetOptions 는 ${offset}${'y' | 'm' | 'd'} 혹은 'td' 문자열로만 이루어진 배열만 넣을 수 있습니다.
 *
 * (ex) 'td', '3d', '2m', '1y'
 */
const StartYmdSelector = ({
  disabled = false,
  className = '',
  offsetOptions = DEFAULT_OFFSET_OPTIONS,
  initialOffsetOption,
  onChange,
  startYmdQueryParamKey = DEFAULT_START_YMD_QUERY_PARAM_KEY,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const datePeriodSelectBoxOptions = useMemo(
    () => offsetOptions.map((offsetOption) => convertDateOffsetOptionToSelectBoxOption(offsetOption)),
    [offsetOptions]
  );

  const handleStartYmdSelect = ({ currentTarget: { value } }) => {
    searchParams.set(startYmdQueryParamKey, value);
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    const currentStartYmd = searchParams.get(startYmdQueryParamKey);
    const optionValues = datePeriodSelectBoxOptions.map(({ value }) => value);

    if (!currentStartYmd || !optionValues.includes(currentStartYmd)) {
      const isInitialOffsetOptionValid = offsetOptions.includes(initialOffsetOption);
      const initialValue = isInitialOffsetOptionValid
        ? convertDateOffsetOptionToSelectBoxOption(initialOffsetOption).value
        : datePeriodSelectBoxOptions[0].value;
      searchParams.set(startYmdQueryParamKey, initialValue);
      setSearchParams(() => searchParams, { replace: true });
    }
  }, [[...searchParams.keys()].length]);

  useEffect(() => {
    if (!searchParams.get(startYmdQueryParamKey)) return;
    onChange?.(searchParams.get(startYmdQueryParamKey));
  }, [searchParams]);

  return (
    <SelectBox
      disabled={disabled}
      className={`start-ymd-selector ${className ?? ''}`}
      options={datePeriodSelectBoxOptions}
      value={searchParams.get(startYmdQueryParamKey) || datePeriodSelectBoxOptions[0].value}
      onSelect={handleStartYmdSelect}
    />
  );
};

export default StartYmdSelector;

StartYmdSelector.propTypes = {
  disabled: bool,
  className: string,
  offsetOptions: arrayOf(string),
  initialOffsetOption: string,
  onChange: func,
  startYmdQueryParamKey: string,
};

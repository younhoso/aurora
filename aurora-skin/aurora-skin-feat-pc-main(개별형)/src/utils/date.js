import dayjs from 'dayjs';
import _isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(_isSameOrAfter);

export const today = dayjs();

export const isSameOrAfter = ({ comparisonDate, baseDate = today, comparisonUnit = 'day' }) =>
  baseDate.isSameOrAfter(dayjs(comparisonDate), comparisonUnit);

import { BANK_MAP, DELIVERY_COMPANY_TYPE_MAP, RETURN_WAY_TYPE_MAP } from '@shopby/shared';

export const EMAIL_DOMAINS = ['naver.com', 'hanmail.net', 'daum.net', 'nate.com', 'gmail.com'];
export const EMAIL_DOMAIN_OPTIONS = EMAIL_DOMAINS.map((domain) => ({ value: domain, label: domain }));

export const PHONE_CARRIER_NUMBERS_BY_STRING = [
  '02',
  '031',
  '032',
  '033',
  '041',
  '042',
  '043',
  '044',
  '051',
  '052',
  '053',
  '054',
  '055',
  '061',
  '062',
  '063',
  '064',
  '070',
];

export const PHONE_NUMBER_INPUT_SECTIONS = ['carrierNumber', 'firstSerial', 'secondSerial'];

export const NAME_INPUT_MAX_LENGTH = 15;
export const INVOICE_NO_MAX_LENGTH = 20;
export const DELIVERY_MEMO_MAX_LENGTH = 20;
export const CLAIM_REASON_DETAIL_MAX_LENGTH = 300;

export const RETURN_WAY_OPTIONS = Object.entries(RETURN_WAY_TYPE_MAP).map(([value, label]) => ({ label, value }));
export const DELIVERY_COMPANY_OPTIONS = Object.entries(DELIVERY_COMPANY_TYPE_MAP).map(([value, label]) => ({
  label,
  value,
}));
export const BANK_OPTIONS = Object.entries(BANK_MAP)
  .map(([value, label]) => ({ label, value }))
  .filter(({ value }) => value !== 'ANONYMOUS');

import { CLIENT_ERROR } from '@shopby/shared';

export default {
  [CLIENT_ERROR.NONEXISTENT_PRODUCT]: {
    next: '/',
  },
  [CLIENT_ERROR.INACCESSIBLE_PRODUCT]: {
    next: '/',
  },
  [CLIENT_ERROR.ADULT_CERTIFIED_PRODUCT]: {
    next: '/adult-certification',
  },
  [CLIENT_ERROR.FORBIDDEN_ARTICLE]: {
    next: '/sign-in',
  },
  [CLIENT_ERROR.NO_AUTHORIZATION]: {
    next: '/sign-in',
  },
  [CLIENT_ERROR.GUEST_TOKEN_EXPIRED]: {
    next: '/sign-in',
  },
  [CLIENT_ERROR.MY_ORDER_FAIL_NO_ORDER]: {
    next: 'back',
  },
  [CLIENT_ERROR.MY_ORDER_FAIL_NOT_YOUR_ORDER]: {
    next: 'back',
  },
  [CLIENT_ERROR.PRODUCT_DETAIL_FAIL_PROHIBITION_STATUS]: {
    next: '/',
  },
};

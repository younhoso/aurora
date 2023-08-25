import { CLIENT_ERROR_MESSAGE, CLIENT_ERROR } from '@shopby/shared';

export default {
  [CLIENT_ERROR.FORBIDDEN_ARTICLE]: {
    message: `${CLIENT_ERROR_MESSAGE[CLIENT_ERROR.FORBIDDEN_ARTICLE]} \n로그인 하시겠습니까?`,
    next: '/sign-in',
  },
};

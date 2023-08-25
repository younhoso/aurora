/**
 * key로 설정한 값으로 시작하는 location에서 일어난 에러에 대한 기본 핸들러를 정의합니다.
 * 핸들러를 조회할 때 순차 탐색이 진행되므로, 우선되어야 할 핸들러를 위에 위치시켜주세요.
 *
 * alertMap, confirmMap에 정의된 핸들러가 우선됩니다.
 */
export default {
  '/claim/': {
    next: '/',
  },
  '/product-detail': {
    next: '/',
  },
};

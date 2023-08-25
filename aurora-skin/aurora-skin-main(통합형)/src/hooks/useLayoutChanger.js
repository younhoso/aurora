import { useEffect } from 'react';

import { LAYOUT_DEFAULT_STATE, useLayoutActionContext } from '../components/LayoutProvider';

/**
 * 레이아웃의 헤더 및 푸터 형태 설정을 할 수 있는 커스텀 훅.
 * 인자 객체로 담지 않은 값들은 기본 값으로 설정됩니다.
 *
 * [기본 값]
 * isMain: false,
 * hasBackBtnOnHeader: false,
 * hasHomeBtnOnHeader: false,
 * hasCartBtnOnHeader: false,
 * hasBottomNav: false,
 * hasCancelBtnOnHeader: false,
 * title: '',
 * @param {{ isMain?: boolean, hasHomeBtnOnHeader?: boolean, hasBackBtnOnHeader?: boolean, hasCartBtnOnHeader?: boolean, hasCancelBtnOnHeader?: boolean, hasBottomNav?: boolean, title?: string }} layoutStatus
 */

const useLayoutChanger = (layoutStatus = LAYOUT_DEFAULT_STATE) => {
  const { changeLayoutStatus } = useLayoutActionContext();

  useEffect(() => {
    if (changeLayoutStatus) {
      changeLayoutStatus(layoutStatus);
    }
  }, [changeLayoutStatus, layoutStatus]);
};

export default useLayoutChanger;

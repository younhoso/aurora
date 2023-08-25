import { isMobile } from 'react-device-detect';

import { PLATFORM_TYPE } from '@shopby/shared';

import { YorN } from '../constants/common';

export const platformType = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;

export const convertBooleanToYorN = (enable) => (enable ? YorN.Y : YorN.N);

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

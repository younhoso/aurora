import { isMobile } from 'react-device-detect';

const shouldRedirect = () => {
  const { pathname, hostname } = location;

  if (hostname === 'localhost') return false;

  if (isMobile && pathname.startsWith('/m')) return false;

  if (!isMobile && !pathname.startsWith('/m')) return false;

  return true;
};

export const getRedirectUri = (mallUrl) => {
  if (!shouldRedirect()) return '';

  const { pathname, search } = location;

  return `${mallUrl[isMobile ? 'mobile' : 'pc']}${pathname.replace('/m', '')}${search}`;
};

export const goTo = (uri) => {
  if (!uri) return;

  location.href = uri;
};

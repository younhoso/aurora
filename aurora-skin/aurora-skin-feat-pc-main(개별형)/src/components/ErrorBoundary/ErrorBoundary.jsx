import { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { node, element, oneOfType } from 'prop-types';

import { useModalActionContext } from '@shopby/react-components';

import { EXPIRED_MALL_CODE, EXPIRED_MALL_PATH, NOT_FOUND_PATH, SERVICE_CHECK_PATH } from '../../constants/api';

import alertMap from './alertMap';
import confirmMap from './confirmMap';
import { exceptCodes } from './exceptCode';
import locationMap from './locationMap';

const getErrorState = (event) => {
  const error = event?.reason?.error ?? event.error?.error ?? event.error;

  if (error?.code) {
    return {
      code: error?.code,
      description: error?.description ?? error?.message,
    };
  }

  if (error?.serverError) {
    return {
      code: error.serverError?.code,
      description: error.serverError?.message,
    };
  }

  return {
    code: event.reason?.code ?? '',
    description: event.reason?.message ?? '',
  };
};

const getToAndFrom = (modal, location) => {
  const to = modal?.next === 'back' ? -1 : modal?.next;
  const from = `${location.pathname}${location.search}`;

  return {
    to,
    from,
  };
};

const alertError = ({ alert, description, openAlert, navigate }) => {
  const message = alert?.message ?? description;
  const { to, from } = getToAndFrom(alert, location);

  openAlert({
    message,
    onClose: () =>
      alert?.next &&
      navigate(to, {
        state: {
          from,
          to,
        },
      }),
  });
};

const confirmError = ({ confirm, openConfirm, description, navigate }) => {
  const message = confirm?.message ?? description;
  const { to, from } = getToAndFrom(confirm, location);

  openConfirm({
    message,
    onConfirm: () =>
      confirm?.next &&
      navigate(to, {
        state: {
          from,
          to,
        },
      }),
  });
};

const alertLocationError = ({ unexpectedServerErrorBoundaryInformation, openAlert, description, navigate }) => {
  const message = unexpectedServerErrorBoundaryInformation?.message ?? description;
  const { to, from } = getToAndFrom(unexpectedServerErrorBoundaryInformation, location);

  openAlert({
    message,
    onClose: () =>
      unexpectedServerErrorBoundaryInformation?.next &&
      navigate(to, {
        state: {
          from,
          to,
        },
      }),
  });
};

// 예상하지 못한 서버 오류 핸들맵
const getUnexpectedServerErrorHandleMap = (error) => {
  // eslint-disable-next-line no-unused-vars
  const [_, handleMap] = Object.entries(locationMap).find(([key]) => location.pathname?.startsWith(key)) ?? [];

  if (handleMap && error?.serverError) {
    return handleMap;
  }

  return null;
};

// status 에 의한 공통 오류 핸들
const exceptPathnames = [SERVICE_CHECK_PATH, EXPIRED_MALL_PATH, NOT_FOUND_PATH];
// eslint-disable-next-line complexity
const getStatusErrorHandleMap = (event) => {
  if (exceptPathnames.includes(window.location.pathname)) return '';

  const serverError = event?.reason?.error?.serverError;

  if (!serverError) return '';

  const status = serverError?.status;

  const hasBeenExpiredMall = serverError?.code === EXPIRED_MALL_CODE || event?.reason?.code === EXPIRED_MALL_CODE;
  if (status === 400 && hasBeenExpiredMall) return EXPIRED_MALL_PATH;

  if (status === 402) return EXPIRED_MALL_PATH;

  if (`${status}`?.startsWith('5')) return SERVICE_CHECK_PATH;

  return '';
};

const ErrorBoundaryActionContext = createContext(null);

const ErrorBoundary = ({ children }) => {
  const { openAlert, openConfirm } = useModalActionContext();

  const location = useLocation();
  const navigate = useNavigate();

  const catchError = (error) => {
    const { code, description } = error.error ?? error ?? {};

    const alert = alertMap[code];
    const confirm = confirmMap[code];
    const unexpectedServerErrorBoundaryInformation = getUnexpectedServerErrorHandleMap(error);

    if (exceptCodes.includes(code)) {
      return;
    }

    if (alert) {
      alertError({
        alert,
        description,
        openAlert,
        navigate,
      });

      return;
    }

    if (confirm) {
      confirmError({
        confirm,
        description,
        openConfirm,
        navigate,
      });

      return;
    }

    if (unexpectedServerErrorBoundaryInformation) {
      alertLocationError({
        unexpectedServerErrorBoundaryInformation,
        description,
        openAlert,
        navigate,
      });

      return;
    }

    if (description) {
      openAlert({
        message: description,
        onClose: () => {
          if (error.status === 403) {
            navigate('/', {
              replace: true,
            });
          }
        },
      });
    }

    if (error?.serverError?.status === 404) {
      window.location.href = NOT_FOUND_PATH;
    }
  };

  const catchErrorEvent = (event) => {
    console.log('caught error event: ', event);

    event.preventDefault();

    const statusErrorLocation = getStatusErrorHandleMap(event);

    if (statusErrorLocation) {
      window.location.href = statusErrorLocation;

      return;
    }

    const error = getErrorState(event);
    catchError(error);
  };

  useEffect(() => {
    window.addEventListener('unhandledrejection', catchErrorEvent);
    window.addEventListener('error', catchErrorEvent);

    return () => {
      window.removeEventListener('unhandledrejection', catchErrorEvent);
      window.addEventListener('error', catchErrorEvent);
    };
  }, [location.pathname, location.search]);

  return <ErrorBoundaryActionContext.Provider value={{ catchError }}>{children}</ErrorBoundaryActionContext.Provider>;
};

export const useErrorBoundaryActionContext = () => {
  const context = useContext(ErrorBoundaryActionContext);
  if (!context) throw new Error('INVALID_MyShippingAddressActionContext');

  return context;
};

export default ErrorBoundary;

ErrorBoundary.propTypes = {
  children: oneOfType([node, element]),
};

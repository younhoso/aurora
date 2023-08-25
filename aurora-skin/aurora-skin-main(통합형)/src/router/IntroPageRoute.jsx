import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';

import { node } from 'prop-types';

import { useMallStateContext } from '@shopby/react-components';
import { INTRO_PAGE_TYPE_MAP, isAgeVerified, isSignedIn } from '@shopby/shared';

const platformType = isMobile ? 'mobile' : 'pc';

const exceptPaths = [
  '/adult-certification',
  '/no-access',
  '/member-only',
  '/sign-up/form',
  '/sign-up',
  '/sign-in',
  '/find-id',
  '/find-password',
  '/change-password',
  '/callback',
  '/not-found',
  '/callback/auth-callback',
  '/service-check',
  '/expired-mall',
];

const INTRO_PAGE_ROUTING_MAP = {
  [INTRO_PAGE_TYPE_MAP.ONLY_ADULT]: {
    next: '/adult-certification',
    shouldGoToOwnPage: () => isAgeVerified(),
  },
  [INTRO_PAGE_TYPE_MAP.NO_ACCESS]: {
    next: '/no-access',
    shouldGoToOwnPage: () => false,
  },
  [INTRO_PAGE_TYPE_MAP.ONLY_MEMBER]: {
    next: '/member-only',
    shouldGoToOwnPage: () => isSignedIn(),
  },
};

const IntroPageRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const { mall } = useMallStateContext();

  const condition = INTRO_PAGE_ROUTING_MAP[mall.introRedirection[platformType]];

  useEffect(() => {
    if (condition) {
      if (!condition?.shouldGoToOwnPage() && !exceptPaths.includes(location.pathname)) {
        navigate(condition.next, {
          replace: true,
          state: {
            from: `${location.pathname}${location.search}`,
            isIntroPage: true,
          },
        });
      }
    }

    setIsLoading(false);
  }, [location, condition]);

  if (isLoading) return <></>;

  return children;
};

export default IntroPageRoute;

IntroPageRoute.propTypes = {
  children: node,
};

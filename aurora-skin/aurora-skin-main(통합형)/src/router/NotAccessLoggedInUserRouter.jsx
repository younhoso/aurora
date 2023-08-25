import { Navigate } from 'react-router-dom';

import { node } from 'prop-types';

import { isSignedIn } from '@shopby/shared';

const NotAccessLoggedInUserRouter = ({ children }) => {
  if (isSignedIn()) {
    return <Navigate replace={true} to="/" />;
  }

  return children;
};

export default NotAccessLoggedInUserRouter;

NotAccessLoggedInUserRouter.propTypes = {
  children: node,
};

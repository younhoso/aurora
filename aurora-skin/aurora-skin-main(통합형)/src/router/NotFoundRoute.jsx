import { Navigate } from 'react-router-dom';

const ENVIRONMENT_PATH = '/environment.json';

const NotFoundRoute = () => {
  const { href } = location;

  const isEnvironmentPage = href.includes(ENVIRONMENT_PATH);

  if (isEnvironmentPage) {
    window.location.href = ENVIRONMENT_PATH;

    return <></>;
  }

  return <Navigate to="not-found" />;
};

export default NotFoundRoute;

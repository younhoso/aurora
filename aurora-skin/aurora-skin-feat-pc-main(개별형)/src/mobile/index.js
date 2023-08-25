import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { setupMswWorker, PLATFORM_TYPE } from '@shopby/shared';

import '@shopby/shared/styles/common';
import '@shopby/shared/styles/component';
import '@shopby/shared/styles/aurora';

import '../assets/style.css';
import './assets/style.css';

import App from './App.jsx';
import '../i18n';
import { initializeShopApi } from '../utils';

const renderApp = async () => {
  const usesMock = false; // Whether or not to use msw worker/

  const { clientId, profile } = await initializeShopApi({
    platform: PLATFORM_TYPE.MOBILE_WEB
  });

  const isDevMode = process.env.NODE_ENV === 'development';

  if (isDevMode && usesMock) {
    const worker = setupMswWorker();
    worker.start();
  }

  const app = document.getElementById('app');
  const root = createRoot(app);

  root.render(
    <BrowserRouter basename={isDevMode ? '' : '/m'}>
      <App clientId={clientId} profile={profile} />
    </BrowserRouter>
  );
};

renderApp();
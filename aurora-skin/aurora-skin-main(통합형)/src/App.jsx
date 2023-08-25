import { Suspense } from 'react';
import { isMobile } from 'react-device-detect';

import { string } from 'prop-types';

import {
  AuthProvider,
  MallProvider,
  Modal,
  ModalProvider,
  TermsProvider,
  PageScriptsProvider,
  DesignPopupProvider,
  BoardConfigurationProvider,
} from '@shopby/react-components';

import { ErrorBoundary } from './components/ErrorBoundary';
import Router from './router';

const App = ({ clientId, profile }) => (
  <Suspense>
    <ModalProvider>
      <ErrorBoundary>
        <MallProvider clientId={clientId} mallProfile={profile}>
          <BoardConfigurationProvider>
            <AuthProvider>
              <TermsProvider termsTypes={['MALL_INTRODUCTION', 'USE', 'PI_PROCESS', 'ACCESS_GUIDE']}>
                <PageScriptsProvider platform={isMobile ? 'MOBILE' : 'PC'}>
                  <DesignPopupProvider>
                    <Router />
                    <Modal />
                  </DesignPopupProvider>
                </PageScriptsProvider>
              </TermsProvider>
            </AuthProvider>
          </BoardConfigurationProvider>
        </MallProvider>
      </ErrorBoundary>
    </ModalProvider>
  </Suspense>
);
export default App;

App.propTypes = {
  clientId: string.isRequired,
  profile: string.isRequired,
};

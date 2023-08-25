import { SignInProvider, OpenIdSignInProvider } from '@shopby/react-components';

import OpenIdCallbackForm from './OpenIdCallbackForm';

const OpenIdCallback = () => (
  <SignInProvider>
    <OpenIdSignInProvider>
      <OpenIdCallbackForm />
    </OpenIdSignInProvider>
  </SignInProvider>
);

export default OpenIdCallback;

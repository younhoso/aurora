import { isMobile } from 'react-device-detect';

import 'whatwg-fetch';
import '@testing-library/jest-dom/extend-expect';
import dotenv from 'dotenv';

import { PLATFORM_TYPE, apiCreator, setupMswForJest } from '@shopby/shared';

dotenv.config({ path: './config/.env.development' });

apiCreator({
  baseURL: process.env.API_BASE_URL,
  headerOption: {
    clientId: process.env.CLIENT_ID,
    platform: isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC,
  },
});

setupMswForJest();

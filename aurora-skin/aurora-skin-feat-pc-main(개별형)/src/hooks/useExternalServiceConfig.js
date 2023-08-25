import { setGoogleAnalytics, setNaverWebmaster } from '@shopby/shared/utils';

const useExternalServiceConfig = () => {
  const _setGoogleAnalytics = (externalServiceConfig) => {
    const googleAnalyticsId = externalServiceConfig?.googleAnalytics;

    if (!googleAnalyticsId) return;

    setGoogleAnalytics(googleAnalyticsId);
  };

  const _setNaverWebmaster = (externalServiceConfig) => {
    const naverWebmasterKey = externalServiceConfig?.naverWebmaster;

    if (!naverWebmasterKey) return;

    setNaverWebmaster(naverWebmasterKey);
  };

  const setExternalService = (externalServiceConfig) => {
    _setGoogleAnalytics(externalServiceConfig);
    _setNaverWebmaster(externalServiceConfig);
  };

  return {
    setExternalService,
  };
};

export default useExternalServiceConfig;

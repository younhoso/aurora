import { useMemo } from 'react';

import { useTermsStateContext } from '@shopby/react-components';

import ServiceInformation from './ServiceInformation';

const FOOTER_TERMS_LABEL_MAP = {
  MALL_INTRODUCTION: '회사소개',
  USE: '이용약관',
  PI_PROCESS: '개인정보처리방침',
  ACCESS_GUIDE: '이용안내',
};

const Footer = () => {
  const { terms } = useTermsStateContext();

  const services = useMemo(
    () =>
      Object.entries(FOOTER_TERMS_LABEL_MAP)
        .map(([key, label]) => {
          const { used = false, contents = '', enforcementDate = '' } = terms[key];
          return {
            key,
            label,
            used,
            content: contents,
            enforcementDate,
          };
        })
        .filter(({ used }) => used) ?? [],
    [terms]
  );

  return (
    <footer className="footer">
      <ServiceInformation terms={services} />
    </footer>
  );
};

export default Footer;

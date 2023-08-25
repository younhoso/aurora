import { useMemo } from 'react';

import { useTermsStateContext } from '@shopby/react-components';

import ServiceInformation from '../../../components/Footer/ServiceInformation';
import Menu from './Menu';

const TERMS_LABEL_MAP_FOR_SERVICE_INFORMATION = {
  USE: '이용약관',
  PI_PROCESS: '개인정보처리방침',
};

const TERMS_LABEL_MAP_FOR_MENU = {
  MALL_INTRODUCTION: '회사소개',
  ACCESS_GUIDE: '이용안내',
};

const divideTermsBy = (termsLabelMap, terms) => {
  return (
    Object.entries(termsLabelMap)
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
      .filter(({ used }) => used) ?? []
  );
};

const Footer = () => {
  const { terms } = useTermsStateContext();
  const termsForServiceInformation = useMemo(
    () => divideTermsBy(TERMS_LABEL_MAP_FOR_SERVICE_INFORMATION, terms),
    [terms]
  );

  const termsForMenu = useMemo(() => divideTermsBy(TERMS_LABEL_MAP_FOR_MENU, terms), [terms]);

  return (
    <footer className="footer">
      <div className="pc-content-width">
        <ServiceInformation terms={termsForServiceInformation} />
        <Menu terms={termsForMenu} />
      </div>
    </footer>
  );
};

export default Footer;

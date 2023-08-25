import { bool, shape, string, arrayOf, number } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

import KcCertification from './KcCertificationInformation';

const CertificationInformation = ({ includesKcInDutyInfo, showsOnPageDetail, certificationInformation }) => {
  const showsCertificationInformationTitle =
    showsOnPageDetail || (!includesKcInDutyInfo && certificationInformation?.certificationType !== 'NOT_TARGET');

  const showsCertificationInformationContent =
    !includesKcInDutyInfo && certificationInformation?.certificationType === 'TARGET';

  return (
    <>
      <VisibleComponent
        shows={showsCertificationInformationTitle}
        TruthyComponent={<p className="product-content__title">인증 정보</p>}
      />
      <VisibleComponent
        shows={showsCertificationInformationContent}
        TruthyComponent={
          <>
            <KcCertification certifications={certificationInformation?.certifications} />
          </>
        }
      />
      <VisibleComponent
        shows={certificationInformation?.certificationType === 'DETAIL_PAGE'}
        TruthyComponent={<p>상품 상세페이지 내 별도 표기</p>}
      />
    </>
  );
};

CertificationInformation.propTypes = {
  includesKcInDutyInfo: bool,
  showsOnPageDetail: bool,
  certificationInformation: shape({
    certificationType: string,
    certifications: arrayOf(
      shape({
        no: number,
        type: string,
        code: string,
        date: string,
      })
    ),
  }),
};

export default CertificationInformation;

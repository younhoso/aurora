import { arrayOf, shape, string, number } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

import { SPECIAL_KC } from '../../../constants/certification';

const KcCertification = ({ certifications = [] }) => (
  <>
    {certifications.map((certification, index) => (
      <dl className="kc-info" key={`${certification.no}-${index}`}>
        <dt>{certification.type} 안전확인 대상 품목으로 아래의 국가 통합인증 필함</dt>
        <VisibleComponent
          shows={SPECIAL_KC.includes(certification.code) || SPECIAL_KC.includes(certification.type)}
          TruthyComponent={
            <dd>
              <span className="kc-logo" />
              <span>
                인증 날짜: <a href="https://rra.go.kr/ko/license/A_c_search.do">{certification.date}</a>
              </span>
            </dd>
          }
          FalsyComponent={
            <dd>
              <span className="kc-logo" />
              인증 번호:{' '}
              <a href={`https://www.safetykorea.kr/search/searchPop?certNum=${certification.code}`}>
                {certification.code}
              </a>
            </dd>
          }
        />
      </dl>
    ))}
  </>
);

KcCertification.propTypes = {
  certifications: arrayOf(
    shape({
      no: number,
      type: string,
      code: string,
      date: string,
    })
  ),
};

export default KcCertification;

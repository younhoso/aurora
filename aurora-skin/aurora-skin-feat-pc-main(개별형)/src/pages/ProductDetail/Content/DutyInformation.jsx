import { bool, arrayOf, shape, string, number } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

import KcCertification from './KcCertificationInformation';

const DutyInformation = ({ hasDutyInfo, includesKcInDutyInfo, contents = [], certifications }) => (
  <>
    <VisibleComponent
      shows={hasDutyInfo}
      TruthyComponent={<p className="product-content__title">상품정보제공고시</p>}
    />
    <VisibleComponent
      shows={hasDutyInfo}
      TruthyComponent={
        <div className="product-content__certification product-content__certification--duty-info">
          {contents.map(({ label, description }, index) => (
            <dl key={index}>
              <dt>{label}</dt>
              <dd>
                {
                  <VisibleComponent
                    shows={includesKcInDutyInfo && label.startsWith('KC')}
                    TruthyComponent={
                      <>
                        {description}
                        <KcCertification certifications={certifications} />
                      </>
                    }
                    FalsyComponent={description}
                  />
                }
              </dd>
            </dl>
          ))}
        </div>
      }
    />
  </>
);

export default DutyInformation;

DutyInformation.propTypes = {
  hasDutyInfo: bool,
  includesKcInDutyInfo: bool,
  contents: arrayOf(
    shape({
      label: string,
      description: string,
    })
  ),
  certifications: arrayOf(
    shape({
      no: number,
      type: string,
      code: string,
      date: string,
    })
  ),
};

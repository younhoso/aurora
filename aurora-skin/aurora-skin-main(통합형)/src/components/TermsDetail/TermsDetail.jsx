import { useEffect, useMemo, useRef, useState } from 'react';

import { string, func } from 'prop-types';

import { SelectBox, VisibleComponent, useTermsActionContext, useTermsStateContext } from '@shopby/react-components';
import { TERMS_HISTORY_KEY_TYPE } from '@shopby/shared';

import { isSameOrAfter } from '../../utils';
import FullModal from '../FullModal';
import Sanitized from '../Sanitized';

const termsHistoryKeys = [TERMS_HISTORY_KEY_TYPE.USE, TERMS_HISTORY_KEY_TYPE.PI_PROCESS];

const TermsDetail = ({ termsKey, content, title, onClose }) => {
  const { termsHistory, termsDetail } = useTermsStateContext();
  const { fetchTermsHistory, fetchTermsDetail } = useTermsActionContext();

  const [termsNo, setTermsNo] = useState(0);

  const contentRef = useRef();

  const currentTermsHistory = useMemo(
    () =>
      termsHistory[termsKey]?.filter(({ enforcementDate }) => isSameOrAfter({ comparisonDate: enforcementDate }))?.at(),
    [termsHistory]
  );

  const termsHistorySelectOptions = useMemo(
    () =>
      termsHistory[termsKey]?.map(({ termsNo, enforcementDate, termsEnforcementStatusLabel }) => ({
        value: termsNo,
        label: `${enforcementDate}${termsEnforcementStatusLabel ? ` (${termsEnforcementStatusLabel})` : ''}`,
      })),
    [termsHistory]
  );

  const changeTermsNo = (termsNo) => {
    fetchTermsDetail(termsNo);
    setTermsNo(termsNo);
    contentRef?.current?.scrollIntoView();
  };

  useEffect(() => {
    termsHistoryKeys.includes(termsKey) && fetchTermsHistory({ termsHistoryType: termsKey });
  }, [termsKey]);

  useEffect(() => {
    currentTermsHistory?.termsNo && changeTermsNo(currentTermsHistory.termsNo);
  }, [currentTermsHistory]);

  return (
    <FullModal className="agreement" title={title} onClose={onClose}>
      <Sanitized ref={contentRef} html={termsDetail.contents ? termsDetail.contents : content} />
      <VisibleComponent
        shows={termsNo}
        TruthyComponent={
          <SelectBox
            value={termsNo}
            options={termsHistorySelectOptions}
            onSelect={({ currentTarget }) => {
              changeTermsNo(currentTarget.value);
            }}
          />
        }
      />
    </FullModal>
  );
};

export default TermsDetail;

TermsDetail.propTypes = {
  termsKey: string,
  content: string,
  title: string,
  onClose: func,
};

import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { pick } from 'lodash-es';
import { string, arrayOf, object, func } from 'prop-types';

import { Button } from '@shopby/react-components';
import { convertToKoreanCurrency, NEXT_ACTION_TYPE_MAP } from '@shopby/shared';

import OptionLabel from '../../../components/OptionLabel';

const WITHDRAW_ACTION_TYPES_MAP = pick(NEXT_ACTION_TYPE_MAP, [
  'WITHDRAW_CANCEL',
  'WITHDRAW_EXCHANGE',
  'WITHDRAW_RETURN',
]);
const WITHDRAW_ACTION_TYPES = Object.keys(WITHDRAW_ACTION_TYPES_MAP);

const ClaimSummary = ({ claimYmdt, orderNo, claimedOptions, onWithdrawClaimBtnClick }) => {
  const claimYmd = useMemo(() => claimYmdt.slice(0, 10), [claimYmdt]);

  return (
    <div className="claims__claim-summary">
      <p className="claims__identifier">
        <time dateTime={claimYmd} className="bold">
          {claimYmd.split('-').join('.')}
        </time>
        <span className="claims__order-no">{orderNo}</span>
      </p>
      {claimedOptions.map(
        ({
          imageUrl,
          optionName,
          optionValue,
          inputs: optionInputs,
          orderOptionNo,
          productName,
          price: { buyAmt },
          claimStatusTypeLabel,
          nextActions,
          optionType,
        }) => (
          <article key={orderOptionNo} className="claims__product-wrap">
            <Link className="claims__product" to={`/orders/${orderNo}`}>
              <img src={imageUrl} alt={`${productName} 이미지`} />
              <div className="claims__product-description">
                <p className="claims__product-name">{productName}</p>
                <p className="claims__product-option-label">
                  {optionType !== 'PRODUCT_ONLY' && (
                    <OptionLabel optionName={optionName} optionValue={optionValue} optionInputs={optionInputs} />
                  )}
                </p>
                <div className="claims__product-bottom">
                  <div className="claims__product-tag">
                    <span className="claims__pay-amount-label">
                      <span className="claims__pay-amount">{convertToKoreanCurrency(buyAmt)}</span> 원
                    </span>
                    <span className="highlight">{claimStatusTypeLabel}</span>
                  </div>
                </div>
              </div>
            </Link>
            {nextActions.map(({ nextActionType }) => {
              if (WITHDRAW_ACTION_TYPES.includes(nextActionType)) {
                return (
                  <Button
                    key={nextActionType}
                    className="claims__withdraw-btn"
                    onClick={(e) =>
                      onWithdrawClaimBtnClick?.(e, orderOptionNo, WITHDRAW_ACTION_TYPES_MAP[nextActionType])
                    }
                  >
                    {WITHDRAW_ACTION_TYPES_MAP[nextActionType]}
                  </Button>
                );
              }

              return <Fragment key={nextActionType}></Fragment>;
            })}
          </article>
        )
      )}
    </div>
  );
};

export default ClaimSummary;

ClaimSummary.propTypes = {
  claimYmdt: string,
  orderNo: string,
  claimedOptions: arrayOf(object),
  onWithdrawClaimBtnClick: func,
};

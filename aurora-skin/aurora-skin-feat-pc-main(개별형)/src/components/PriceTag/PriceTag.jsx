import { Fragment } from 'react';

import { shape, string, arrayOf, bool, node, element, oneOfType } from 'prop-types';

// import('./_price-tag.scss');

// TODO: i18n

/* eslint-disable react/prop-types */
const FinalAmount = ({ name, amountLabel, currencyLabel }) => (
  <dl className="price-tag__final-amount">
    <dt>{name}</dt>
    <dd>
      <em>{amountLabel}</em>
      {currencyLabel}
    </dd>
  </dl>
);

const PriceDetails = ({ details, currencyLabel }) => (
  <dl className="price-tag__details">
    {details.map(({ name, amountLabel }) => (
      <Fragment key={name}>
        <dt>{name}</dt>
        <dd>
          <em>{amountLabel}</em>
          {currencyLabel}
        </dd>
      </Fragment>
    ))}
  </dl>
);
/* eslint-enable react/prop-types */

const PriceTag = ({
  finalAmount: { name = '최종 결제 금액', amountLabel },
  details = [],
  currencyLabel = '원',
  isUpsideDown = false,
  showsBorder = true,
  children,
}) => {
  if (isUpsideDown)
    return (
      <div className={`price-tag ${showsBorder ? '' : 'price-tag--no-border'}`}>
        <FinalAmount name={name} amountLabel={amountLabel} currencyLabel={currencyLabel} />
        <div className="price-tag__division" />
        <PriceDetails details={details} currencyLabel={currencyLabel} />
        {children}
      </div>
    );

  return (
    <div className={`price-tag ${showsBorder ? '' : 'price-tag--no-border'}`}>
      <PriceDetails details={details} currencyLabel={currencyLabel} />
      <div className="price-tag__division" />
      <FinalAmount name={name} amountLabel={amountLabel} currencyLabel={currencyLabel} />
      {children}
    </div>
  );
};

export default PriceTag;

PriceTag.propTypes = {
  finalAmount: shape({
    name: string,
    amountLabel: string.isRequired,
  }).isRequired,
  details: arrayOf(
    shape({
      name: string.isRequired,
      amountLabel: string.isRequired,
    })
  ).isRequired,
  currencyLabel: string,
  isUpsideDown: bool,
  showsBorder: bool,
  children: oneOfType([node, element]),
};

import { Checkbox, useClaimActionContext, useClaimStateContext } from '@shopby/react-components';

import ProductThumbItem from '../../components/ProductThumbItem';

const ClaimProductTable = () => {
  const { allClaimableOptions, claimSelectStatus } = useClaimStateContext();
  const { toggleOneOrderOption, changeClaimAmount } = useClaimActionContext();

  const handleClaimAmountChange = (value, orderOptionNo) => {
    changeClaimAmount({ [orderOptionNo]: value });
  };

  return (
    <section className="claim__section claim__products">
      {allClaimableOptions.map(
        ({ brandName, productName, optionName, optionValue, price, imageUrl, orderOptionNo, productNo }) => (
          <div key={orderOptionNo} className="claim__product">
            <Checkbox
              isRounded={true}
              checked={claimSelectStatus[orderOptionNo]?.isChecked}
              onChange={() => toggleOneOrderOption({ orderOptionNo: orderOptionNo.toString() })}
            />
            <ProductThumbItem
              imageUrl={imageUrl}
              brandName={brandName ?? ''}
              productName={productName}
              productNo={productNo}
              optionName={optionName}
              optionValue={optionValue}
              buyAmt={price.buyAmt}
              usesQuantityChanger={true}
              quantityChangerValue={claimSelectStatus[orderOptionNo]?.claimAmount}
              onQuantityChange={(quantity) => handleClaimAmountChange(quantity, orderOptionNo)}
            />
          </div>
        )
      )}
    </section>
  );
};

export default ClaimProductTable;

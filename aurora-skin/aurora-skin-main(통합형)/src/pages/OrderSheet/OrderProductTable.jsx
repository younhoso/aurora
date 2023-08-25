import { useTranslation } from 'react-i18next';

import { Accordion, ThumbList, useOrderSheetStateContext } from '@shopby/react-components';

import ProductThumbItem from '../../components/ProductThumbItem';

const OrderProductTable = () => {
  const { t } = useTranslation(['common', 'order']);
  const { flattenedOrderProductOptions } = useOrderSheetStateContext();

  return (
    <section className="l-panel">
      <Accordion className="order-sheet__product-table" title={t('orderProduct', { ns: 'order' })} isOpen={true}>
        <ThumbList>
          {flattenedOrderProductOptions.map(
            (
              { imageUrl, brandName, productName, orderCnt, optionName, optionValue, optionInputs, price, productNo },
              idx
            ) => (
              <ProductThumbItem
                productNo={productNo}
                key={idx}
                imageUrl={imageUrl}
                brandName={brandName}
                productName={productName}
                orderCnt={orderCnt}
                buyAmt={price.buyAmt}
                optionName={optionName}
                optionValue={optionValue}
                optionInputs={optionInputs}
              />
            )
          )}
        </ThumbList>
      </Accordion>
    </section>
  );
};

export default OrderProductTable;

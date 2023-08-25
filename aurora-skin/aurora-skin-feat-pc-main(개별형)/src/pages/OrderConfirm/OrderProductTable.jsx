import { ThumbList, Accordion, useOrderConfirmStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import ProductThumbItem from '../../components/ProductThumbItem';

const OrderProductTable = () => {
  const {
    flattenedOrderOptions,
    orderInfo: {
      lastOrderAmount: { chargeAmt },
    },
  } = useOrderConfirmStateContext();
  return (
    <section className="l-panel order-confirm__product-table">
      <Accordion
        isOpen={true}
        Title={
          <div className="order-confirm__product-table-tit">
            <span>주문내역</span>
            <div className="order-confirm__product-table-amt">
              <span>
                <em className="highlight bold">{flattenedOrderOptions.length}</em>개{' '}
              </span>
              <span>
                <em className="highlight bold">{convertToKoreanCurrency(chargeAmt)}</em>원
              </span>
            </div>
          </div>
        }
      >
        <ThumbList>
          {flattenedOrderOptions.map(
            ({
              imageUrl,
              brandName,
              productName,
              orderCnt,
              buyAmt,
              optionName,
              optionValue,
              inputs,
              optionNo,
              productNo,
            }) => (
              <ProductThumbItem
                productNo={productNo}
                key={optionNo}
                imageUrl={imageUrl}
                brandName={brandName ?? ''}
                productName={productName}
                orderCnt={orderCnt}
                buyAmt={buyAmt}
                optionName={optionName}
                optionValue={optionValue}
                optionInputs={inputs}
              />
            )
          )}
        </ThumbList>
      </Accordion>
    </section>
  );
};

export default OrderProductTable;

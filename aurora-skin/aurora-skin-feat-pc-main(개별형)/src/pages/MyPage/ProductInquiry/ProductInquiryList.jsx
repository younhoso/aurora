import { arrayOf, shape, func, number, string, bool } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

import { InquiryItem } from '../../../components/Board';
import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';

const EmptyProductInquiryList = () => (
  <div className="empty-list">
    <p>작성된 상품문의가 없습니다.</p>
  </div>
);

const ProductInquiryList = ({ items = [], onModify, onDelete, isLoading }) => {
  const handleModifyButtonClick = (inquiryDetail) => {
    onModify(inquiryDetail);
  };

  const handleDeleteButtonClick = (inquiryDetail) => {
    onDelete(inquiryDetail);
  };

  return (
    <>
      <VisibleComponent
        shows={items.length > 0}
        TruthyComponent={
          <>
            <div className="product-inquiry-list">
              {items.map((item) => (
                <InquiryItem
                  key={item.inquiryNo}
                  isReplied={item.hasBeenReplied}
                  canModify={item.canModify}
                  title={item.title}
                  content={item.content}
                  registerDate={item.registerYmdt.slice(0, 10)}
                  images={item.images}
                  isMine={item.isMine}
                  isSecreted={item.isSecreted}
                  onModify={() => handleModifyButtonClick(item)}
                  onDelete={() => handleDeleteButtonClick(item)}
                  answers={
                    item.answers?.map((answer) => ({
                      no: answer.inquiryNo,
                      content: answer.content,
                      registerYmdt: answer.registerYmdt,
                    })) ?? []
                  }
                />
              ))}
            </div>
            <ListSkeleton className="product-inquiry-list" isLoading={isLoading} />
          </>
        }
        FalsyComponent={
          isLoading ? (
            <ListSkeleton className="product-inquiry-list" isLoading={isLoading} />
          ) : (
            <EmptyProductInquiryList />
          )
        }
      />
    </>
  );
};

export default ProductInquiryList;

ProductInquiryList.propTypes = {
  items: arrayOf(
    shape({
      inquiryNo: number,
      memberId: string,
      modifiable: bool,
      myInquiry: bool,
      isReplied: bool,
      isSecreted: bool,
      registerDate: string,
      title: string,
      content: string,
      answers: arrayOf(
        shape({
          no: number,
          content: string,
          registerYmdt: string,
        })
      ),
    })
  ),
  onModify: func,
  onDelete: func,
  isLoading: bool,
};

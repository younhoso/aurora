import { string, arrayOf, oneOf, shape, number, func } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

import { InquiryItem } from '../../../components/Board';

const PersonalInquiryList = ({ items = [], onModify, onDelete }) => {
  const handleModifyButtonClick = (inquiryDetail) => {
    onModify(inquiryDetail);
  };

  const handleDeleteButtonClick = (inquiryDetail) => {
    onDelete(inquiryDetail);
  };

  return (
    <VisibleComponent
      shows={items.length > 0}
      TruthyComponent={
        <div className="personal-inquiry-list">
          {items.map((item) => (
            <InquiryItem
              key={item.inquiryNo}
              inquiryTypeLabel={item.inquiryTypeInformation.name}
              isReplied={item.inquiryStatus === 'ANSWERED'}
              canModify={item.inquiryStatus !== 'ANSWERED'}
              title={item.inquiryTitle}
              content={item.inquiryContent}
              registerDate={item.registerYmdt.slice(0, 10)}
              images={item.images}
              isMine={true}
              onModify={() => handleModifyButtonClick(item)}
              onDelete={() => handleDeleteButtonClick(item)}
              answers={item.answerInformation ? [item.answerInformation] : []}
            />
          ))}
        </div>
      }
    />
  );
};

PersonalInquiryList.propTypes = {
  items: arrayOf(
    shape({
      inquiryNo: number,
      inquiryStatus: oneOf(['ISSUED', 'ANSWERED', 'IN_PROGRESS', 'ASKED']),
      inquiryTitle: string,
      inquiryContent: string,
      registerYmdt: string,
      images: arrayOf(
        shape({
          imageUrl: string,
          originFileName: string,
        })
      ),
    })
  ),
  onModify: func,
  onDelete: func,
};

export default PersonalInquiryList;

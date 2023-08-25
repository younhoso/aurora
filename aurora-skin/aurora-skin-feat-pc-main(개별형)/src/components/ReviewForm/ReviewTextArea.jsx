import { string, func } from 'prop-types';

import { CharacterCounter, useProductReviewStateContext } from '@shopby/react-components';

const ReviewTextArea = ({ content, onChange }) => {
  const { reviewConfig } = useProductReviewStateContext();

  const handleReviewContentChange = ({ character: { value } }) => {
    onChange(value);
  };

  return (
    <div className="review-form__text-area">
      <CharacterCounter
        id="review-form-text-area"
        name="review-form-text-area"
        counterType="CHARACTER"
        textType="TEXT_AREA"
        placeholder={
          reviewConfig.expandedReviewConfig?.writingReviewNoticeText
            ? reviewConfig.expandedReviewConfig?.writingReviewNoticeText
            : '상품후기를 작성해주세요.'
        }
        cols="30"
        rows="10"
        value={content}
        valid="NO_COMMON_SPECIAL"
        onChange={handleReviewContentChange}
        limitCount={{
          character: 1000,
        }}
      />
    </div>
  );
};

export default ReviewTextArea;

ReviewTextArea.propTypes = {
  content: string,
  onChange: func,
};

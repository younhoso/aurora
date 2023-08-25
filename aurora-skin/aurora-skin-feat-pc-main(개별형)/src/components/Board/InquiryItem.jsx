import { useMemo, useState } from 'react';

import { string, arrayOf, func, shape, bool, number } from 'prop-types';

import { Button, AngleTopDown, Icon, VisibleComponent } from '@shopby/react-components';

import FoldingImagesByOneRow from '../FoldingImagesByOnRow';
import Sanitized from '../Sanitized';

const InquiryItem = ({
  inquiryTypeLabel = '',
  memberId = '',
  title = '',
  content = '',
  isReplied = false,
  registerDate = '',
  images = [],
  answers = [],
  canModify = true,
  isMine = false,
  isSecreted = false,
  onModify,
  onDelete,
}) => {
  const [isActive, setIsActive] = useState(false);

  const { modifier: inquiryStatusModifier, label: inquiryStatusLabel } = useMemo(() => {
    if (isReplied) {
      return {
        modifier: 'answered',
        label: '답변완료',
      };
    }

    return {
      modifier: 'ready',
      label: '답변대기',
    };
  }, [isReplied]);

  const _canModify = useMemo(() => {
    if (canModify) return true;

    if (isReplied) return false;

    if (isMine) return true;

    return false;
  }, [isReplied, canModify, isMine]);

  const handleModifyButtonClick = () => {
    onModify();
  };

  const handleDeleteButtonClick = () => {
    onDelete();
  };

  return (
    <div className={`inquiry-item ${isActive ? 'is-active' : ''}`}>
      <div className="inquiry-item__top">
        {inquiryTypeLabel && <p>{`문의유형 -  ${inquiryTypeLabel}`}</p>}
        <p>{memberId}</p>
        <p className="inquiry-item__date">{registerDate}</p>
      </div>
      <div className="inquiry-item__bottom">
        <FoldingImagesByOneRow
          isActive={isActive}
          images={images.map(({ imageUrl, originFileName }) => ({
            src: imageUrl,
            name: originFileName,
          }))}
        />
        <div className="inquiry-item__content">
          <div className="inquiry-item__info">
            <p className={`inquiry-item__status-label inquiry-item__status-label--${inquiryStatusModifier}`}>
              {inquiryStatusLabel}
            </p>
            <VisibleComponent shows={isSecreted} TruthyComponent={<Icon name="lock" />} />
            <VisibleComponent
              shows={isSecreted && !isMine}
              TruthyComponent={'비밀글입니다.'}
              FalsyComponent={<p className="inquiry-item__title">{title}</p>}
            />
            <VisibleComponent
              shows={!(isSecreted && !isMine)}
              TruthyComponent={
                <AngleTopDown className="inquiry-item__angle-top-down" onToggle={() => setIsActive((prev) => !prev)} />
              }
            />
          </div>
          <div className="inquiry-item__text inquiry-item__text--question">
            <Icon name="q" />

            <div className="inquiry-item__qna-text editor">
              <Sanitized html={content} />
            </div>
          </div>

          <VisibleComponent
            shows={_canModify}
            TruthyComponent={
              <div className="board-form__buttons--small">
                <Button label="수정" onClick={handleModifyButtonClick} />
                <Button label="삭제" onClick={handleDeleteButtonClick} />
              </div>
            }
          />

          <VisibleComponent
            shows={answers.length > 0}
            TruthyComponent={answers.map(({ no, content, registerYmdt }, index) => (
              <div key={`${no}-${index}`} className={'inquiry-item__text inquiry-item__text--answer'}>
                <Icon name="a" />

                <div className="inquiry-item__qna-text">
                  <Sanitized html={content} />
                  <span className="inquiry-item__date">답변일 : {registerYmdt}</span>
                </div>
              </div>
            ))}
          />
        </div>
      </div>
    </div>
  );
};

InquiryItem.propTypes = {
  onModify: func.isRequired,
  onDelete: func.isRequired,
  memberId: string,
  inquiryTypeLabel: string,
  isReplied: bool,
  title: string,
  content: string,
  registerDate: string,
  images: arrayOf(
    shape({
      imageUrl: string,
      originFileName: string,
    })
  ),
  isMine: bool,
  isSecreted: bool,
  canModify: bool,
  answers: arrayOf(
    shape({
      no: number,
      content: string,
      registerYmdt: string,
    })
  ),
  canAttach: bool,
};

export default InquiryItem;

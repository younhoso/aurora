import { useState } from 'react';

import { Button , Checkbox, useOrderSheetActionContext, useOrderSheetStateContext } from '@shopby/react-components';

import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized/Sanitized';

const TermsChecker = () => {
  const { termsStatus } = useOrderSheetStateContext();
  const { updateTermsStatus } = useOrderSheetActionContext();
  const [isTermContentsModalOpen, setIsTermContentsModalOpen] = useState(false);
  const [clickedTerm, setClickedTerm] = useState(null);

  const handleTermCheckboxClick = (e, termsType) => {
    const isChecked = e.currentTarget.checked;

    updateTermsStatus({
      [termsType]: {
        ...termsStatus[termsType],
        isChecked,
      },
    });
  };

  const showDetailBtnClick = (title, contents) => {
    setClickedTerm({ title, contents });
    setIsTermContentsModalOpen(true);
  };

  const handleTermContentModalClose = () => {
    setIsTermContentsModalOpen(false);
  };

  return (
    <section className="l-page order-sheet__terms">
      {Object.entries(termsStatus).map(([termsType, { isChecked, isRequired, title, contents }]) => (
        <div key={termsType} className="order-sheet__term-checker">
          <Checkbox
            isRounded={true}
            label={`[${isRequired ? '필수' : '선택'}] ${title}`}
            checked={isChecked}
            onClick={(e) => handleTermCheckboxClick(e, termsType)}
          />
          {contents && <Button label="보기" onClick={() => showDetailBtnClick(title, contents)} />}
        </div>
      ))}
      {Boolean(isTermContentsModalOpen && clickedTerm) && (
        <FullModal title={clickedTerm.title} onClose={handleTermContentModalClose}>
          <Sanitized html={clickedTerm.contents} style={{ padding: '20px' }} />
        </FullModal>
      )}
    </section>
  );
};

export default TermsChecker;

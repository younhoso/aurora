import { Link } from 'react-router-dom';

import { useMallStateContext, VisibleComponent } from '@shopby/react-components';

import { NOTICE_BOARD_ID } from '../../constants/board';

const Cs = () => {
  const { boardsCategories } = useMallStateContext();
  const notice = boardsCategories.find(({ boardId }) => boardId === NOTICE_BOARD_ID);

  return (
    <div className="cs">
      <VisibleComponent
        shows={notice?.used}
        TruthyComponent={
          <Link className="cs__link" to="/notice">
            {notice?.boardName}
          </Link>
        }
      />
      <Link className="cs__link" to="/customer-center">
        고객센터
      </Link>
    </div>
  );
};

export default Cs;

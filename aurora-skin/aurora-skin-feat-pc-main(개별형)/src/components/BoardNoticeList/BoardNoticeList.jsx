import { arrayOf, string } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

const BoardNoticeList = ({ texts = [], title = '유의사항' }) => (
  <VisibleComponent
    shows={texts.length > 0}
    TruthyComponent={
      <div className="board-form__notes">
        <dl className="board-form__note">
          <dt className="board-form__note-title">{title}</dt>
          {texts.map((text, index) => (
            <dd key={index} className="board-form__note-text">
              {text}
            </dd>
          ))}
        </dl>
      </div>
    }
  />
);

export default BoardNoticeList;

BoardNoticeList.propTypes = {
  texts: arrayOf(string).isRequired,
  title: string,
};

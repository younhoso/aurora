import { func } from 'prop-types';

import { CustomModal, SearchField, RecentKeyword, RecentKeywordProvider } from '@shopby/react-components';

import useSearchKeyword from '../../hooks/useSearchKeyword';
import BackButton from '../BackButton';

const SearchKeywordContent = ({ openModal }) => {
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword('');

  const searchKeyword = (_keyword) => {
    searchProductsByKeyword(_keyword);
    location.href = `/products?keyword=${encodeURIComponent(_keyword)}`;
  };

  return (
    <>
      <div className="search-keyword-modal__top">
        <BackButton className="search-keyword-modal__back-btn" onClick={() => openModal(false)} />
        <SearchField
          searchValue={keyword}
          onSearchBtnClick={() => searchKeyword(keyword)}
          onClearBtnClick={removeKeyword}
          onChange={({ target }) => updateKeyword(target.value)}
        />
      </div>
      <RecentKeyword onKeywordClick={(_keyword) => searchKeyword(_keyword)} />
    </>
  );
};

SearchKeywordContent.propTypes = {
  openModal: func,
};

const SearchKeyword = ({ openModal }) => (
  <CustomModal className="title-modal--full search-keyword-modal">
    <RecentKeywordProvider>
      <div>
        <SearchKeywordContent openModal={openModal} />
      </div>
    </RecentKeywordProvider>
  </CustomModal>
);

export default SearchKeyword;

SearchKeyword.propTypes = {
  openModal: func,
};

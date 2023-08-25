import { RecentKeywordProvider, useBannerStateContext, IconSVG, TextField } from '@shopby/react-components';

import Nav from '../../../components/Nav/Nav';

import MallLogo from '../../../components/Header/MallLogo';
import useSearchKeyword from '../../../hooks/useSearchKeyword';

const SearchField = () => {
  const { keyword, searchProductsByKeyword, updateKeyword } = useSearchKeyword('');

  const searchKeyword = (_keyword) => {
    searchProductsByKeyword(_keyword);
    location.href = `/products?keyword=${encodeURIComponent(_keyword)}`;
  };

  const handleSearchButtonClick = () => {
    searchKeyword(keyword);
  };

  const handleSearchKeywordChange = ({ currentTarget }) => updateKeyword(currentTarget.value);

  return (
    <span className="search-field">
      <TextField className="search-field__text" value={keyword} onChange={handleSearchKeywordChange} />
      <button className="search-field__button" onClick={handleSearchButtonClick}>
        <IconSVG name="magnet" size={28} />
      </button>
    </span>
  );
};

const Header = () => {
  const { bannerMap } = useBannerStateContext();

  return (
    <div className="header">
      <MallLogo banner={bannerMap.get('LOGO')} />
      <Nav />
      <RecentKeywordProvider>
        <SearchField />
      </RecentKeywordProvider>
    </div>
  );
};

export default Header;

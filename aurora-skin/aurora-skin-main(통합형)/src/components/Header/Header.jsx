import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

import { func, string, bool } from 'prop-types';

import {
  RecentKeywordProvider,
  SearchField,
  useBannerStateContext,
  useModalActionContext,
  useOffCanvasActionContext,
  IconBtn,
  CartBtn,
  IconSVG,
} from '@shopby/react-components';

import useSearchKeyword from '../../hooks/useSearchKeyword';
import BackButton from '../BackButton';
import { useLayoutValueContext } from '../LayoutProvider';
import Nav from '../Nav/Nav';

import MallLogo from './MallLogo';

const MainHeader = ({ openCanvas }) => (
  <button className="hamburger-menu header__left-btn" onClick={openCanvas}>
    <IconSVG name="hamburger" size={50} strokeWidth={3} />
    <span className="a11y">좌측 메뉴 보기</span>
  </button>
);
MainHeader.propTypes = {
  openCanvas: func,
};

const SearchKeywordHeader = ({ title }) => {
  const { openAlert } = useModalActionContext();
  const [showsSearchKeyword, setShowsSearchKeyword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword(title);
  const keywordParam = searchParams.get('keyword');

  const searchKeyword = (_keyword) => {
    if (!_keyword) {
      openAlert({
        message: '키워드를 입력하세요.',
      });

      return;
    }

    searchProductsByKeyword(_keyword);
    setSearchParams({
      keyword,
    });
  };

  useEffect(() => {
    if (!keywordParam) return;

    searchProductsByKeyword(keywordParam);
    updateKeyword(keywordParam);
  }, [keywordParam]);

  return (
    <>
      {showsSearchKeyword ? (
        <SearchField
          className="header__search-field"
          searchValue={keyword}
          onSearchBtnClick={() => searchKeyword(keyword)}
          onClearBtnClick={removeKeyword}
          onChange={({ target }) => updateKeyword(target.value)}
        />
      ) : (
        <button className="header__title" onClick={() => setShowsSearchKeyword((prev) => !prev)}>
          {keyword}
        </button>
      )}
    </>
  );
};
SearchKeywordHeader.propTypes = {
  title: string,
};
const Content = ({ isMain, hasSearchKeywordHeader, title }) => {
  const { bannerMap } = useBannerStateContext();

  if (isMain) {
    return <MallLogo banner={bannerMap.get('LOGO')} />;
  }

  if (hasSearchKeywordHeader) {
    return (
      <RecentKeywordProvider>
        <SearchKeywordHeader title={title} />
      </RecentKeywordProvider>
    );
  }

  return <h1 className="header__title">{title}</h1>;
};

Content.propTypes = {
  isMain: bool,
  hasSearchKeywordHeader: bool,
  title: string,
};

const Header = () => {
  const {
    isMain = false,
    hasBackBtnOnHeader = false,
    hasCartBtnOnHeader = false,
    hasSearchKeywordHeader = false,
    hasCancelBtnOnHeader = false,
    title = '',
  } = useLayoutValueContext();
  const { openCanvas } = useOffCanvasActionContext();
  const navigate = useNavigate();

  const canShowShoppingBasket = useMemo(
    () => (isMain || hasCartBtnOnHeader) && !hasCancelBtnOnHeader,
    [isMain, hasCartBtnOnHeader]
  );

  return (
    <>
      <header className={`header ${!isMain ? 'header--sub' : ''}`}>
        {isMain ? (
          <MainHeader openCanvas={openCanvas} />
        ) : (
          hasBackBtnOnHeader && <BackButton label="페이지 뒤로 가기" className="header__left-btn" />
        )}
        <Content isMain={isMain} hasSearchKeywordHeader={hasSearchKeywordHeader} title={title} />
        {canShowShoppingBasket && (
          <div className="header__cart-btn">
            <Link to="/cart">
              <span className="a11y">장바구니 페이지 이동</span>
              <CartBtn />
            </Link>
          </div>
        )}
        {hasCancelBtnOnHeader && (
          <IconBtn className="header__cancel-btn" iconType="x-black" onClick={() => navigate('/')} size="xs" />
        )}
      </header>
      {isMain && <Nav />}
    </>
  );
};

export default Header;

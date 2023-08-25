import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { func } from 'prop-types';

import {
  AddressItem,
  InfiniteScrollLoader,
  SearchAddressForm,
  SearchAddressProvider,
  useSearchAddressActionContext,
  useSearchAddressStateContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../ErrorBoundary';

const INFINITY_SCROLL_LOADER_OPTION = {
  rootMargin: '100px',
  threshold: 0.1,
};

/* eslint-disable-next-line */ // TODO: 타입스크립트 전환 시 수정
const SearchZipCodeFormConsumer = ({ onAddressItemClick }) => {
  const { pageNumber, keyword, searchResult } = useSearchAddressStateContext();
  const [isInfiniteScrollDisabled, setIsInfiniteScrollDisabled] = useState(false);
  const { searchAddresses } = useSearchAddressActionContext();
  const { t } = useTranslation(['manage', 'common']);
  const itemsWrapperRef = useRef();
  const { catchError } = useErrorBoundaryActionContext();

  useEffect(() => {
    if (!searchResult) {
      setIsInfiniteScrollDisabled(false);
    }
  }, [searchResult]);

  const handleOnIntersect = async () => {
    setIsInfiniteScrollDisabled(true);

    if (searchResult && searchResult.itemsLength === searchResult.totalCount) {
      return;
    }

    try {
      await searchAddresses({ pageNumber: pageNumber + 1, keyword });
      setIsInfiniteScrollDisabled(false);
    } catch (e) {
      catchError(e);
    }
  };

  return (
    <div className="search-zip-code-form">
      <div className="search-zip-code-form__search">
        <SearchAddressForm placeholder={t('roadName + buildingNumber, buildingName, lotNumber')} />
        <p className="search-zip-code-form__search-tip">
          {t('Integrated search is possible for road name, building name, and lot number.')}
        </p>
      </div>
      <p className="search-zip-code-form__tip-tit">
        {searchResult ? (
          <>
            {t('allSearchResult', { ns: 'common' })}&nbsp;&nbsp;<em>{searchResult.totalCount}</em>
          </>
        ) : (
          <>
            <em>TIP!</em>&nbsp;&nbsp;{t('Search like this.')}
          </>
        )}
      </p>
      {searchResult?.totalCount === 0 && (
        <p className="search-zip-code-form__tip-empty">
          {t('No results were found for your search. Please search again.', { ns: 'common' })}
        </p>
      )}
      {searchResult ? (
        <div className="search-zip-code-form__items" ref={itemsWrapperRef}>
          {searchResult.items.map(({ zipCode, jibunAddress, roadAddress }, idx) => (
            <AddressItem
              key={zipCode + idx}
              zipCode={zipCode}
              roadAddress={roadAddress}
              jibunAddress={jibunAddress}
              onClick={onAddressItemClick}
            />
          ))}
          <InfiniteScrollLoader
            rootRef={itemsWrapperRef}
            onIntersect={handleOnIntersect}
            disabled={isInfiniteScrollDisabled}
            option={INFINITY_SCROLL_LOADER_OPTION}
          />
        </div>
      ) : (
        <ul className="search-zip-code-form__tip-list">
          <li>
            {t('roadName + buildingNumber')} <span>({t('example: 9, World Cup-ro 10-gil')})</span>
          </li>
          <li>
            {t('areaName + affix + lotNumber')} <span>({t('example: Seogyo-dong 476-25')})</span>{' '}
          </li>
          <li>
            {t('buildingName(apartmentName)')} <span>({t('example: Banpo Xi Apartment')})</span>
          </li>
        </ul>
      )}
    </div>
  );
};

const SearchZipCodeForm = ({ onAddressItemClick }) => (
  <SearchAddressProvider usesAccumulation>
    <SearchZipCodeFormConsumer onAddressItemClick={onAddressItemClick} />
  </SearchAddressProvider>
);

export default SearchZipCodeForm;

SearchZipCodeForm.propTypes = {
  onAddressItemClick: func,
};

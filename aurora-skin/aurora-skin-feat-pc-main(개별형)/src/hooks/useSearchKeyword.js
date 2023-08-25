import { useState } from 'react';

import { useRecentKeywordActionContext } from '@shopby/react-components';

const useSearchKeyword = (initialKeyword) => {
  const [keyword, setKeyword] = useState(initialKeyword ?? '');

  const { add } = useRecentKeywordActionContext();

  const updateKeyword = (_keyword) => setKeyword(_keyword);

  const removeKeyword = () => setKeyword('');

  const searchProductsByKeyword = (_keyword) => {
    add(_keyword);
    setKeyword(keyword);
  };

  return {
    searchProductsByKeyword,
    removeKeyword,
    updateKeyword,
    keyword,
  };
};

export default useSearchKeyword;

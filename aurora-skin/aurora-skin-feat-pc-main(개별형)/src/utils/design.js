// eslint-disable-next-line complexity
export const getPageTypeInformation = () => {
  const { pathname, searchParams } = new URL(window.location.href);

  const categoryNo = searchParams.get('categoryNo');
  if (pathname.includes('products') && categoryNo) {
    return {
      pageType: 'CATEGORY',
      targetNo: categoryNo,
    };
  }

  const eventNo = pathname.split('/').filter(Boolean).at(1);
  if (pathname.includes('event') && eventNo) {
    return {
      pageType: 'EVENT',
      targetNo: eventNo,
    };
  }

  const productNo = searchParams.get('productNo');
  if (pathname.includes('product-detail') && productNo) {
    return {
      pageType: 'PRODUCT',
      targetNo: productNo,
    };
  }

  if (pathname === '/') {
    return {
      pageType: 'MAIN',
    };
  }

  return null;
};

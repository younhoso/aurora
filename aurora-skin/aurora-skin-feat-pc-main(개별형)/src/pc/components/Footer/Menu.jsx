import { Link } from 'react-router-dom';

import { useBoardConfigurationContextState } from '@shopby/react-components';

const Menu = ({ terms }) => {
  const { boardConfig } = useBoardConfigurationContextState();

  return (
    <div className="boards">
      <dl>
        <dt>ABOUT</dt>
        {terms.map((service, idx) => (
          <dd key={`${service.key}-${idx}`}>
            <Link>{service.label}</Link>
          </dd>
        ))}
      </dl>
      <dl>
        <dt>MY ACCOUNT</dt>
        <dd>
          <Link to="/member-modification">회원정보 수정</Link>
        </dd>
        <dd>
          <Link to="/my-page/accumulation">적립금</Link>
        </dd>
        <dd>
          <Link to="/my-page/coupon">쿠폰</Link>
        </dd>
      </dl>
      <dl>
        <dt>MY ORDER</dt>
        <dd>
          <Link to="/orders">주문/배송</Link>
        </dd>
        <dd>
          <Link to="/claims">취소/교환/반품</Link>
        </dd>
        <dd>
          <Link to="/my-page/like">좋아요</Link>
        </dd>
      </dl>
      <dl>
        <dt>HELP</dt>
        <dd>
          <Link to="/my-page/product-review">상품후기</Link>
        </dd>
        <dd>
          <Link to="/my-page/product-inquiry">상품문의</Link>
        </dd>
        <dd>
          <Link to="/my-page/personal-inquiry">1:1문의</Link>
        </dd>
        {boardConfig?.boardConfigs?.map(({ boardId, name }) => (
          <dd key={`${boardId}-${name}`}>
            <Link to={`/${boardId}`}>{name}</Link>
          </dd>
        ))}
      </dl>
    </div>
  );
};

export default Menu;

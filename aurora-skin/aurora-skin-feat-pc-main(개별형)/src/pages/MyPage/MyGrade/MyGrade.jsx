import { VisibleComponent, useProfileGradeStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

const MyGrade = () => {
  const { profileGrade } = useProfileGradeStateContext();

  return (
    <div className="my-grade">
      <p className="my-grade__title">나의 등급혜택</p>
      <dl className="my-grade__member-grade">
        <dt>회원등급</dt>
        <dd>{profileGrade?.label}</dd>
      </dl>
      <dl className="my-grade__member-coupon">
        <dt>등급 쿠폰 혜택</dt>
        <dd>
          <VisibleComponent
            shows={profileGrade?.coupons.length > 0}
            TruthyComponent={
              <ul>
                {profileGrade?.coupons.map((coupon) => (
                  <li key={coupon.couponNo}>
                    {coupon.couponName} /{' '}
                    {coupon.discountType === 'AMOUNT' ? `${coupon.discountAmount}원` : `${coupon.discountPercent}%`}
                  </li>
                ))}
              </ul>
            }
            FalsyComponent={<span> - </span>}
          />
        </dd>
      </dl>
      <dl className="my-grade__accumulation">
        <dt>등급 적립금 혜택</dt>
        <dd>
          <ul>
            <li>구매 금액의 {profileGrade.reserveBenefit?.canUse ? profileGrade.reserveBenefit?.reserveRate : 0}%</li>
            <li>
              등급 적립금{' '}
              {profileGrade.reserveAutoSupplying?.canUse
                ? convertToKoreanCurrency(profileGrade.reserveAutoSupplying?.amount)
                : 0}
              원
            </li>
          </ul>
        </dd>
      </dl>
    </div>
  );
};

export default MyGrade;

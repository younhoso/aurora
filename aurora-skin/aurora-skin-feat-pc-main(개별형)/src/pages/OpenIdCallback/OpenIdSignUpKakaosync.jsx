import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { string } from 'prop-types';

import {
  Button,
  useOpenIdSignInActionContext,
  useOpenIdSignInValueContext,
  TextField,
  useModalActionContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const OpenIdSignUpKakaosync = ({ orderSheetNo, previousPath, nextPath }) => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUpAgreement'),
  });
  const navigate = useNavigate();
  const { kakaosyncSignUp, updateKakaosyncSignUpMemberInfo, synchronizeOpenId, removePath } =
    useOpenIdSignInActionContext();
  const {
    openIdInfo,
    kakaosyncSignUpMemberInfo: { id, password },
  } = useOpenIdSignInValueContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const movePage = () => {
    if (orderSheetNo) {
      window.location.href = `${window.location.origin}/order/${orderSheetNo}`;
      removePath();
    } else if (nextPath === '/adult-certification') {
      navigate(`${nextPath}`, {
        state: {
          from: previousPath,
          to: nextPath,
        },
      });
      removePath();
    } else {
      navigate(`${previousPath}`, {
        state: {
          from: nextPath,
          to: previousPath,
        },
      });
      removePath();
    }
  };

  const handleKakaosyncSignUp = () => {
    kakaosyncSignUp();
    movePage();
  };

  const validateCheck = () => {
    if (!id) {
      openAlert({
        message: '아이디를 입력해주세요.',
      });

      return false;
    }

    if (!password) {
      openAlert({
        message: '비밀번호를 입력해주세요.',
      });

      return false;
    }

    return true;
  };

  const handleIdConversion = () => {
    if (!validateCheck()) {
      return;
    }
    openConfirm({
      message: `간편로그인으로 회원을 전환하시겠습니까? \n 전환 시 일반회원으로 로그인이 불가합니다.`,
      confirmLabel: '확인',
      onConfirm: async () => {
        try {
          await synchronizeOpenId({ id, password });
          movePage();
        } catch (e) {
          catchError(e);
        }
      },
      cancelLabel: '취소',
      onCancel: () => null,
    });
  };
  const handleKakaosyncSignUpMemberId = ({ currentTarget: { value } }) => {
    updateKakaosyncSignUpMemberInfo({ id: value });
  };
  const handleKakaosyncSignUpMemberPassword = ({ currentTarget: { value } }) => {
    updateKakaosyncSignUpMemberInfo({ password: value });
  };

  return (
    <div className="sign-up-kakaosync">
      <p className="sign-up-kakaosync__sub-title">이미 가입된 회원 정보가 있습니다.</p>
      <div className="sign-up-kakaosync__sign-up-info">
        <span>{openIdInfo.ordinaryMemberResponse.email}</span>
        <span>{`회원가입일 : ${openIdInfo.ordinaryMemberResponse.signUpDateTime}`}</span>
      </div>

      <div className="sign-up-kakaosync__conversion-section">
        <p>
          해당 계정으로 로그인하시면 카카오 계정으로 전환됩니다. <br />
          <strong>카카오 계정으로 전환하신 이후</strong>에는
          <br /> <strong>기존 계정으로 로그인이 불가</strong>합니다.
        </p>
        <div className="sign-up-kakaosync__input-wrap">
          <TextField
            name="id"
            placeholder="아이디"
            onChange={handleKakaosyncSignUpMemberId}
            value={id}
            valid={'NO_SPACE'}
          />
        </div>
        <div className="sign-up-kakaosync__input-wrap">
          <TextField
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleKakaosyncSignUpMemberPassword}
            value={password}
            valid={'NO_SPACE'}
          />
        </div>

        <Button label="간편로그인으로 전환하기" onClick={handleIdConversion} />
      </div>
      <div className="sign-up-kakaosync__sign-up-section">
        <p>아직 회원이 아니라면 원클릭으로 가입하세요.</p>
        <Button label="카카오 계정으로 신규 가입하기" onClick={handleKakaosyncSignUp} />
      </div>
    </div>
  );
};

export default OpenIdSignUpKakaosync;
OpenIdSignUpKakaosync.propTypes = {
  orderSheetNo: string,
  previousPath: string,
  nextPath: string,
};

import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import {
  useOpenIdSignInActionContext,
  useOpenIdSignInValueContext,
  useSignInActionContext,
  useModalActionContext,
  useAuthActionContext,
} from '@shopby/react-components';

import OpenIdSignUpAgreement from './OpenIdSignUpAgreement';
import OpenIdSignUpKakaosync from './OpenIdSignUpKakaosync';

const OpenIdCallbackForm = () => {
  const {
    getOauthOpenId,
    getProfile,
    getPathFromLocalStorage,
    removePath,
    getOauthIdNoToLocalStorage,
    setOauthCompareResultToLocalStorage,
    removeOauthIdNo,
    updateIsAgreement,
    updateIsKakaosync,
  } = useOpenIdSignInActionContext();
  const { signOut } = useAuthActionContext();
  const { reactivateDormantAccount } = useSignInActionContext();
  const { isAgreement, isKakaosync, profileInfo, openIdInfo } = useOpenIdSignInValueContext();

  const { openAlert, openConfirm } = useModalActionContext();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const code = params.get('code');
  const redirectUri = `${window.location.origin}/callback/auth-callback`;

  const pathObject = getPathFromLocalStorage();
  const orderSheetNo = pathObject.orderSheetPath;
  const previousPath = pathObject.previousPath ? pathObject.previousPath : '/';
  const nextPath = pathObject.nextPath ? pathObject.nextPath : '/';

  const previousOauthIdNo = getOauthIdNoToLocalStorage();

  const reactivate = async ({ accessToken }) => {
    await reactivateDormantAccount({ authType: 'NONE', accessToken });

    openAlert({
      message: '휴면해제 되었습니다.',
      onClose: async () => {
        await getProfile();
      },
    });
  };

  useEffect(() => {
    const divideProfileStatus = async () => {
      const {
        data: { dormantMemberResponse, accessToken },
      } = await getOauthOpenId({ code, redirectUri });

      const isDormantMember =
        dormantMemberResponse?.memberName || dormantMemberResponse?.email || dormantMemberResponse?.mobileNo;

      if (isDormantMember) {
        openConfirm({
          message: (
            <>
              장기 미접속으로 인해 휴면회원 전환 상태입니다. <br />
              휴면해제 하시겠습니까?
            </>
          ),
          confirmLabel: '확인',
          onConfirm: () => reactivate({ accessToken }),
          onCancel: async () => {
            await signOut();

            window.location.href = '/';
          },
        });

        return;
      }

      await getProfile();
    };

    if (code) {
      divideProfileStatus();
    }
  }, []);

  useEffect(() => {
    if (profileInfo.memberStatus === 'WAITING' && openIdInfo.ordinaryMemberResponse.signUpDateTime) {
      updateIsKakaosync(true);
    } else if (profileInfo.memberStatus === 'WAITING') {
      updateIsAgreement(true);
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo.memberStatus === 'ACTIVE' && !!orderSheetNo) {
      window.location.href = `${window.location.origin}/order/${orderSheetNo}`;
      removePath();
    } else if (profileInfo.memberStatus === 'ACTIVE' && previousPath === '/adult-certification') {
      navigate(`${nextPath}`, {
        state: {
          from: nextPath,
          to: previousPath,
        },
      });
      removePath();
    } else if (profileInfo.memberStatus === 'ACTIVE') {
      navigate(`${previousPath}`, {
        state: {
          from: previousPath,
          to: nextPath,
        },
      });
      removePath();
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo.oauthIdNo !== '' && previousOauthIdNo && previousOauthIdNo !== profileInfo.oauthIdNo) {
      setOauthCompareResultToLocalStorage(false);
      removeOauthIdNo();
    } else if (profileInfo.oauthIdNo !== '' && previousOauthIdNo === profileInfo.oauthIdNo) {
      setOauthCompareResultToLocalStorage(true);
      removeOauthIdNo();
    }
  }, [profileInfo]);

  return (
    <>
      {isAgreement && (
        <OpenIdSignUpAgreement orderSheetNo={orderSheetNo} previousPath={previousPath} nextPath={nextPath} />
      )}
      {isKakaosync && (
        <OpenIdSignUpKakaosync orderSheetNo={orderSheetNo} previousPath={previousPath} nextPath={nextPath} />
      )}
    </>
  );
};

export default OpenIdCallbackForm;

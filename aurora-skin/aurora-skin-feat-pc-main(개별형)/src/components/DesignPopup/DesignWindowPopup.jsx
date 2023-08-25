import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDesignPopupActionContext, useDesignPopupStateContext } from '@shopby/react-components';

import { getPageTypeInformation } from '../../utils/design';

import { DesignPopupItem } from './DesignPopup';

const DesignWindowPopup = () => {
  const [searchParams] = useSearchParams();
  const popupNo = Number(searchParams.get('popupNo'));
  const pathname = decodeURIComponent(searchParams.get('pathname'));
  const parameter = decodeURIComponent(searchParams.get('parameter'));

  const { designPopups, displayPopups } = useDesignPopupStateContext();
  const { deleteDesignPopupBy, putVisibleTodayBy, fetchDesignPopups, fetchDisplayPopups } =
    useDesignPopupActionContext();
  const popups = useMemo(() => [...designPopups, ...displayPopups], [designPopups, displayPopups]);

  const designPopup = useMemo(() => popups.find((designPopup) => designPopup.popupNo === popupNo), [popups]);

  useEffect(() => {
    const pageTypeInformation = getPageTypeInformation();

    pageTypeInformation &&
      fetchDisplayPopups({
        ...pageTypeInformation,
      });

    fetchDesignPopups({
      pathname,
      parameter,
    });
  }, []);

  if (!designPopup) return <></>;

  return (
    <DesignPopupItem
      {...designPopup}
      detailInfo={{
        ...designPopup.detailInfo,
        screenLeftPosition: 0,
        screenTopPosition: 0,
      }}
      className="design-popup__window"
      isWindowPopup={true}
      onDeleteClick={(popupNo) => {
        deleteDesignPopupBy({
          popupNo,
        });
      }}
      onVisibleTodayClick={(popupNo) => {
        putVisibleTodayBy({
          popupNo,
          shouldHide: true,
        });
      }}
    />
  );
};

export default DesignWindowPopup;

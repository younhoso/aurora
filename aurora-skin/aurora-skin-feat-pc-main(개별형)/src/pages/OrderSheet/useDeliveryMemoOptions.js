import { useTranslation } from 'react-i18next';

const useDeliveryMemoOptions = () => {
  const { t } = useTranslation('order');

  const deliveryMemos = [
    t('Please deliver it quickly.'),
    t('Please contact me before delivery.'),
    t("If I'm out, please put it in front of the door."),
    t("If I'm out, please call me on your cell phone"),
    t('Leave it to the security office, please.'),
    t('Please put it in the delivery box.'),
  ];

  const options = [
    { label: t('requests for delivery'), value: '' },
    { label: t('direct input(up to 30 characters)'), value: 'DIRECT_INPUT' },
    ...deliveryMemos.map((memo) => ({
      label: memo,
      value: memo,
    })),
  ];

  return { options };
};

export default useDeliveryMemoOptions;

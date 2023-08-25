import { YorN } from '../constants/common';

export const getCollectionComments = (returnWay, returnWarehouseLabel) => {
  if (returnWay === 'SELLER_COLLECT')
    return [
      '반품상황에 따라 (반품)택배비를 차감할 수 있습니다.',
      '반품신청이 완료되면 입력하신 수거지주소로 반품수거가 진행됩니다.',
      'CJ대한통운택배기사가 1~2일 내에 직접 방문합니다.',
      '반품등록일 오후 5시까지 접수분은 익일로 반품접수 됩니다.',
      '단, 토/일/공휴일은 다음 근무일에 처리 됩니다.',
    ];

  return [
    '반품상황에 따라 (반품)택배비를 차감할 수 있습니다.',
    '반품신청이 완료되면 구매자가 반품할 상품을 반품주소로 직접 보내주셔야 합니다.(착불 불가)',
    `반품주소: ${returnWarehouseLabel}`,
  ];
};

export const deliverableProduct = (searchParams) => searchParams.get('deliverable') !== YorN.N;

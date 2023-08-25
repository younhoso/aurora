export const SLIDE_COUNT_MAP = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export const SLIDE_DIRECTION_MAP = {
  FIXED: {
    effect: 'fade',
    direction: 'horizontal',
    reverseDirection: false,
  },
  RIGHT: {
    effect: 'slide',
    direction: 'horizontal',
    reverseDirection: false,
  },
  LEFT: {
    effect: 'slide',
    direction: 'horizontal',
    reverseDirection: true,
  },
  UP: {
    effect: 'slide',
    direction: 'vertical',
    reverseDirection: false,
  },
  DOWN: {
    effect: 'slide',
    direction: 'vertical',
    reverseDirection: true,
  },
};

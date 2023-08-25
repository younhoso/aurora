import { EventProvider } from '@shopby/react-components';

import EventContents from './EventContents';

const SELECT_OPTION = [
  { value: 'ADMIN_SETTING', label: '추천순' },
  { value: 'BEST_SELLER', label: '판매량순' },
  { value: 'BEST_REVIEW', label: '상품후기순' },
];

const EventPage = () => (
  <EventProvider>
    <EventContents sortBy={SELECT_OPTION} />
  </EventProvider>
);

export default EventPage;

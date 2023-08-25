import { forwardRef } from 'react';

import { string, object } from 'prop-types';

const { sanitize } = require('dompurify');

const Sanitized = forwardRef(({ html, style, className = '' }, ref) => (
  <div
    ref={ref}
    className={`editor ${className}`}
    dangerouslySetInnerHTML={{
      __html: sanitize(html ?? '', {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['iframe', 'a'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'rel', 'type'],
      }),
    }}
    style={style}
  />
));

Sanitized.displayName = 'Sanitized';

Sanitized.propTypes = {
  className: string,
  style: object,
  html: string,
};

export default Sanitized;

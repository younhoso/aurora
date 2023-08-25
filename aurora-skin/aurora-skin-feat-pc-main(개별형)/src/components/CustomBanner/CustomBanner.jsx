import { oneOf, string } from 'prop-types';

const CustomBanner = ({ className, href, target, src, alt, width, height }) =>
  href ? (
    <a className={className} href={href} rel="noreferrer" target={target}>
      <img src={src} alt={alt} loading="lazy" width={width} height={height} />
    </a>
  ) : (
    <img className={className} src={src} alt={alt} loading="lazy" width={width} height={height} />
  );

export default CustomBanner;

CustomBanner.propTypes = {
  className: string,
  href: string,
  target: oneOf(['_blank', '_self']),
  src: string,
  alt: string,
  width: string,
  height: string,
};

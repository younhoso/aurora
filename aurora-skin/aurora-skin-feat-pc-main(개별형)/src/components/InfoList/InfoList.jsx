import { string, arrayOf } from 'prop-types';

const InfoList = ({ title, infos, className = '' }) => (
  <div className={`info-list ${className}`}>
    {title && <p className="info-list__title">{title}</p>} {/* TODO: 아이콘 삽입 */}
    <ul className="info-list__items">
      {infos.map((info) => (
        <li key={info}>{info}</li>
      ))}
    </ul>
  </div>
);

export default InfoList;

InfoList.propTypes = {
  title: string,
  infos: arrayOf(string).isRequired,
  className: string,
};

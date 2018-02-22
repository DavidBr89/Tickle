import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import cxs from 'cxs';

import cx from './Card.scss';

import { colorScale } from './styles';

const shadowStyle = {
  boxShadow: '9px 9px grey',
  border: '1px solid grey'
};

const EmptySmallTags = ({ data, style }) => (
  <div
    style={{
      display: 'flex',
      ...style
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data.map(t => (
      <small key={t} style={{ background: 'grey' }} className={`${cx.tag}`}>
        <span style={{ opacity: 0 }}>{t}</span>
      </small>
    ))}
  </div>
);

EmptySmallTags.propTypes = {
  data: PropTypes.array,
  style: PropTypes.object
};

EmptySmallTags.defaultProps = {
  data: ['tag', 'tag1', 'tag2'],
  style: {}
};
const PlaceholderAttr = ({ text, style }) => (
  <div
    style={{
      display: 'flex',
      border: 'grey 1px dashed',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <h4
      style={{
        // width: '10%',
        marginTop: '4px',
        marginBottom: '4px',
        color: 'grey',
        paddingLeft: '2px',
        ...style
      }}
    >
      {text}
    </h4>
    <i
      className="fa fa-1x fa-plus"
      aria-hidden="true"
      style={{
        textalign: 'center',
        // width: '10%',
        marginLeft: '2px',
        color: 'grey',
        pointerevents: 'cursor'
      }}
    />
  </div>
);
PlaceholderAttr.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object
};
PlaceholderAttr.defaultProps = {
  style: {}
};

const PlaceholderCard = ({
  title,
  tags,
  img,
  challengeType,
  onClick,
  style
}) => (
  <div
    style={{
      padding: '5px',
      backfaceVisibility: 'hidden',
      height: '100%',
      background: challengeType ? colorScale(challengeType) : 'lightgrey',
      ...shadowStyle,
      ...style
    }}
    onClick={onClick}
  >
    <div className={cx.cardHeader}>
      {title ? (
        <div
          style={{
            width: '100%',
            height: '24px',
            background: 'grey',
            // border: 'black 1px solid',
            marginTop: '4px',
            marginBottom: '4px'
          }}
        />
      ) : (
        <div style={{ height: '10%', width: '100%', marginBottom: '4px' }}>
          <PlaceholderAttr
            text={'Title'}
            style={{ height: '20px', fontSize: '18px' }}
          />
        </div>
      )}
    </div>
    {tags ? (
      <EmptySmallTags
        style={{ height: '18px' }}
        data={['sasa', 'osaas', 'sa']}
      />
    ) : (
      <div style={{ height: '18%' }}>
        <PlaceholderAttr
          text={'Tags'}
          style={{ height: '14px', fontSize: '14px' }}
        />
      </div>
    )}
    <div className="mt-1 mb-1" style={{ height: '50%' }}>
      {img ? (
        <img
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
          src={img}
          alt="Card cap"
        />
      ) : (
        <PlaceholderAttr
          text={'IMG'}
          style={{ height: '20px', fontSize: '18px' }}
        />
      )}
    </div>
  </div>
);

PlaceholderCard.propTypes = {
  title: PropTypes.bool,
  tags: PropTypes.bool,
  img: PropTypes.bool,
  challengeType: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object
};

PlaceholderCard.defaultProps = {
  title: false,
  tags: false,
  img: false,
  challengeType: null,
  style: {},
  onClick: d => d
};

export default PlaceholderCard;

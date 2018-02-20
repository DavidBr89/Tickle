import React from 'react';
import PropTypes from 'prop-types';
import cx from './Card.scss';

import { EditButton } from './layout';

import { shadowStyle } from './styles';

const btnStyle = { fontSize: '1.5rem' };
const CardHeader = ({
  title,
  // img,
  onClose,
  children,
  flipHandler,
  editButton,
  style,
  background,
  placeholder
  // id
}) => (
  <div
    className={`${cx.cardMini2}`}
    style={{
      background,
      overflow: 'hidden',
      height: '100%',
      ...style,
      ...shadowStyle
    }}
  >
    <div
      className="mb-2"
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%'
        // height: '100%'
      }}
    >
      {/* TODO: cleaner solution */}
      <button className="btn mr-1" style={btnStyle} onClick={flipHandler}>
        <i className="fa fa-retweet fa-lg" aria-hidden="true" />
      </button>
      <div style={{ display: 'inline-flex', width: '70%' }}>
        <h3 className="text-truncate" style={{ marginBottom: '10px' }}>
          {title === null ? (
            <span style={{ fontStyle: editButton ? 'italic' : null }}>
              {placeholder}
            </span>
          ) : (
            title
          )}
        </h3>
        {editButton}
      </div>
      <button className="btn" style={btnStyle} onClick={onClose}>
        <i className="fa fa-window-close fa-lg" aria-hidden="true" />
      </button>
    </div>
    {children}
  </div>
);

CardHeader.propTypes = {
  title: PropTypes.oneOf([PropTypes.string, null]),
  // tags: PropTypes.array,
  // img: PropTypes.string,
  flipHandler: PropTypes.func,
  background: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  onClose: PropTypes.func,
  editButton: PropTypes.oneOf([PropTypes.node, null]),
  placeholder: PropTypes.string
};

CardHeader.defaultProps = {
  title: null,
  flipHandler: d => d,
  style: {},
  children: <div>{'test'}</div>,
  edit: false,
  onClose: () => null,
  onEdit: () => null,
  background: 'tomato',
  editButton: null,
  placeholder: 'Please add a title'
};

export default CardHeader;

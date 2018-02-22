import React from 'react';
import PropTypes from 'prop-types';
import cx from './Card.scss';

// import { EditButton } from './layout';

import { shadowStyle } from './styles';

const CardHeader = ({
  title,
  // img,
  onClose,
  children,
  // flipHandler,
  editButton,
  style,
  background,
  placeholder,
  uiColor
  // id
}) => {
  const btnStyle = {
    fontSize: '1.5rem',
    padding: '0.4rem 0.6rem 0.4rem 0.6rem',
    background: uiColor,
    color: 'whitesmoke'
  };

  // TODO: change cardMini2 class
  return (
    <div
      className="pl-2 pr-2 pt-2"
      style={{
        background,
        overflow: 'hidden',
        height: '100%',
        backfaceVisibility: 'hidden',
        ...style,
        ...shadowStyle
      }}
    >
      <div
        className="mb-2 pr-2"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <div style={{ display: 'inline-flex', maxWidth: '85%' }}>
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
          {/*TODO: fix button height*/}
          <i className="fa fa-times fa-lg" aria-hidden="true" />
        </button>
      </div>
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  title: PropTypes.oneOf([PropTypes.string, null]),
  // tags: PropTypes.array,
  // img: PropTypes.string,
  // flipHandler: PropTypes.func,
  background: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  onClose: PropTypes.func,
  editButton: PropTypes.oneOf([PropTypes.node, null]),
  placeholder: PropTypes.string,
  uiColor: PropTypes.string
};

CardHeader.defaultProps = {
  title: null,
  // flipHandler: d => d,
  style: {},
  children: <div>{'test'}</div>,
  edit: false,
  onClose: () => null,
  onEdit: () => null,
  background: 'tomato',
  editButton: null,
  placeholder: 'Please add a title',
  uiColor: 'black'
};

export default CardHeader;

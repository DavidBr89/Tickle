import React from 'react';
import PropTypes from 'prop-types';
import cx from './Card.scss';

import { EditButton } from './layout';

import { shadowStyle } from './styles';

const CardHeader = ({
  title,
  // img,
  onClose,
  children,
  flipHandler,
  edit,
  onEdit,
  style,
  background
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
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        // height: '100%'
      }}
    >
      {/* TODO: cleaner solution */}
      <button className="close" onClick={flipHandler}>
        <i className="fa fa-retweet fa-lg mr-1" aria-hidden="true" />
      </button>
      <div style={{ display: 'inline-flex', width: '80%' }}>
        <h3 className="text-truncate" style={{ marginBottom: '10px' }}>
          {title}
        </h3>
        {edit && <EditButton className="mr-2" onClick={onEdit} />}
      </div>
      <button className="close mr-2" onClick={onClose}>
        <i className="fa fa-window-close fa-lg" aria-hidden="true" />
      </button>
    </div>
    {children}
  </div>
);

CardHeader.propTypes = {
  title: PropTypes.string,
  // tags: PropTypes.array,
  // img: PropTypes.string,
  flipHandler: PropTypes.func,
  background: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  onEdit: PropTypes.func
};

CardHeader.defaultProps = {
  title: 'testcard',
  flipHandler: d => d,
  style: {},
  children: <div>{'test'}</div>,
  edit: false,
  onClose: () => null,
  onEdit: () => null,
  background: 'tomato'
};

export default CardHeader;

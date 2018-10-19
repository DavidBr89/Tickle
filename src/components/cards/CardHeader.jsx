import React from 'react';
import PropTypes from 'prop-types';

// import { EditButton } from './layout';
import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import * as Icon from 'react-feather';
//
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
  edit,
  onHeaderClick
  // id
}) => {
  const btnStyle = {
    fontSize: '1.5rem',
    height: '100%',
    cursor: 'pointer'
    // marginBottom: 10,
    // padding: '0.4rem 0.6rem 0.4rem 0.6rem'
    //
    // width: '10%'
    // color: 'whitesmoke'
  };

  // TODO: change cardMini2 class
  return (
    <CardThemeConsumer>
      {({ stylesheet }) => (
        <div
          className="p-2"
          style={{
            width: '100%',
            height: '100%',
            ...shadowStyle,
            ...style
          }}
        >
          <div
            style={{
              // TODO: check
              background,
              // overflow: 'hidden',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div>{editButton}</div>
              <div
                className="ml-1"
                style={{ maxWidth: '90%' }}
                onClick={onHeaderClick}
              >
                <h1 style={{ marginBottom: 0 }} className="text-truncate">
                  {title === null ? (
                    <span className="text-muted">{placeholder}</span>
                  ) : (
                    title
                  )}
                </h1>
              </div>
              <div style={{ position: 'absolute', right: 0 }}>
                <button
                  className="btn"
                  style={btnStyle}
                  onClick={onClose}
                >
                  {/* TODO: fix button height */}
                  <Icon.X size={30} />
                </button>
              </div>
            </div>
            {children}
          </div>
        </div>
      )}
    </CardThemeConsumer>
  );
};

CardHeader.propTypes = {
  title: PropTypes.oneOf([PropTypes.string, null]),
  // tags: PropTypes.array,
  // img: PropTypes.string,
  // flipHandler: PropTypes.func,
  background: PropTypes.string,
  edit: PropTypes.boolean,
  children: PropTypes.node,
  style: PropTypes.object,
  onClose: PropTypes.func,
  editButton: PropTypes.oneOf([PropTypes.node, null]),
  placeholder: PropTypes.string,
  uiColor: PropTypes.string,
  onHeaderClick: PropTypes.func
};

CardHeader.defaultProps = {
  title: null,
  // flipHandler: d => d,
  style: {},
  children: <div>test</div>,
  edit: false,
  onClose: () => null,
  onEdit: () => null,
  background: 'tomato',
  editButton: null,
  placeholder: 'No Title',
  uiColor: 'black',
  onHeaderClick: d => d
};

export default CardHeader;

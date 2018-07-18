import React from 'react';
import PropTypes from 'prop-types';

// import { EditButton } from './layout';
import { css } from 'aphrodite/no-important';
import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

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
  edit
  // id
}) => {
  const btnStyle = {
    fontSize: '1.5rem',
    marginBottom: 10,
    padding: '0.4rem 0.6rem 0.4rem 0.6rem'
    //
    // width: '10%'
    // color: 'whitesmoke'
  };

  // TODO: change cardMini2 class
  return (
    <CardThemeConsumer>
      {({ stylesheet }) => (
        <div
          className="pl-2 pr-2 pt-3"
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
              alignItems: 'center',
              // TODO stick to left
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {editButton}
            <div style={{ maxWidth: edit ? '80%' : '90%' }}>
              <h3 className="text-truncate">
                {title === null ? (
                  <span style={{ fontStyle: editButton ? 'italic' : null }}>
                    {placeholder}
                  </span>
                ) : (
                  title
                )}
              </h3>
            </div>
            <button
              className={css(stylesheet.btn)}
              style={btnStyle}
              onClick={onClose}
            >
              {/* TODO: fix button height */}
              <i className="fa fa-times fa-lg" aria-hidden="true" />
            </button>
          </div>
          {children}
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
  uiColor: PropTypes.string
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
  uiColor: 'black'
};

export default CardHeader;

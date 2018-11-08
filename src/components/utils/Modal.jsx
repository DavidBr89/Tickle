import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
// import { connect } from 'react-redux';
// import chroma from 'chroma-js';
import X from 'react-feather/dist/icons/x';

// import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

// const ddg = new DDG('tickle');

export const InlineModal = ({
  visible,
  title,
  children,
  onClose,
  style,
  className
  // background,
}) => (
  <div
    className={`z-50 ${className}`}
    style={{
      width: '100%',
      height: '100%',
      position: visible ? 'fixed' : 'absolute',
      transition: 'top 0.4s',
      pointerEvents: !visible ? 'none' : null,
      left: 0,
      top: visible ? 0 : '200%',
      right: 0,
      bottom: 0
    }}
  >
    <div
      className="h-full w-full"
      style={{
        maxWidth: 500,
        maxHeight: 800,
        margin: 'auto',
        ...style
      }}
    >
      {children}
    </div>
  </div>
);

InlineModal.defaultProps = {
  className: ''
};

export const BareModal = props => ReactDOM.createPortal(
  <InlineModal {...props} />,
  document.querySelector('body'),
);

export const Modal = BareModal;

// TODO: fix padding bottom
// TODO: access child state
export const ModalBody = ({
  children,
  footer,
  style,
  title,
  onClose
}) => (
  <div
    className="modal-content flex flex-col bg-white"
    style={{
      // height: '100%',
      margin: 'auto', // margin: '1.75rem auto',
      transform: 'translate(0, 0)',
      minHeight: 500,
      maxWidth: 500,
      maxHeight: 800,
      boxShadow: 'black 0.2rem 0.2rem',
      ...style
    }}
  >
    <div
      className="flex justify-between items-center p-4"
      style={{
        // padding: '0.5rem',
        // justifyContent: 'space-between',
        // display: 'flex',
        // alignItems: 'center',
        // flexShrink: 0,
        ...style
      }}
    >
      <h1 className="modal-title">{title}</h1>
      <button className="btn" onClick={onClose}>
        <X />
      </button>
    </div>
    <div
      className="flex flex-col p-4 flex-grow overflow-y-auto"
      style={{
        // flex: '1 1 auto',
        // paddingTop: '1rem',
        // paddingLeft: '1rem',
        // paddingRight: '1rem'
      }}
    >
      {children}
    </div>
    {footer && (
      <div
        className="modal-footer flex justify-end flex-no-shrink p-4"
      >
        {footer}
      </div>
    )}
  </div>
);

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  footerBtnText: PropTypes.text,
  styles: PropTypes.object,
  uiColor: PropTypes.string
  // background: PropTypes.string
};

ModalBody.defaultProps = {
  onSubmit: null,
  footerBtnText: 'Close',
  uiColor: 'grey',
  styles: {}
};

const mapStateToProps = state => ({ ...state.Screen });

const mergeProps = (stateProps, _, ownProps) => ({
  ...stateProps,
  ...ownProps
});

const ResponsiveModal = ({ isSmartphone, ...props }) => (
  <BareModal
    className=""
    {...props}
    style={{
      margin: `${!isSmartphone ? '5.5rem' : ''} auto`
    }}
  />
);

export const ConnectedResponsiveModal = connect(
  mapStateToProps,
  null,
  mergeProps,
)(ResponsiveModal);

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
// import { connect } from 'react-redux';
// import chroma from 'chroma-js';
import {X} from 'react-feather';

// import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import {
  stylesheet as defaultStylesheet,
  uiColor as defaultUiColor
} from 'Src/styles/GlobalThemeContext';

// const ddg = new DDG('tickle');

export const InlineModal = ({
  visible,
  title,
  children,
  onClose,
  style,
  uiColor
  // background,
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: visible ? 'fixed' : 'absolute',
      // opacity: visible ? 1 : 0,
      transition: 'top 0.4s',
      pointerEvents: !visible ? 'none' : null,
      zIndex: 30000,
      left: 0,
      top: visible ? 0 : '200%',
      // top: 0,
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

export const BareModal = props =>
  ReactDOM.createPortal(
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
  stylesheet = defaultStylesheet,
  uiColor = defaultUiColor,
  onClose
}) => (
  <div
    className="modal-content flex flex-col"
    style={{
      height: '100%',
      margin: 'auto', // margin: '1.75rem auto',
      transform: 'translate(0, 0)',
      maxWidth: 500,
      maxHeight: 800,
      background: 'whitesmoke',
      ...style
    }}
  >
    <div
      style={{
        padding: '0.5rem',
        borderBottom: `1px solid ${uiColor}`,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      <h3 className="modal-title">{title}</h3>
      <button className="btn" onClick={onClose}>
        <X />
      </button>
    </div>
    <div
      className="flex flex-col"
      style={{
        flex: '1 1 auto',
        overflowY: 'scroll',
        paddingTop: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}
    >
      {children}
    </div>
    {footer && (
      <div
        className="modal-footer"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0,
          borderTop: '1px solid grey',
          padding: '0.5rem'
        }}
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

const mapStateToProps = state => ({...state.Screen});

const mergeProps = (stateProps, _, ownProps) => ({
  ...stateProps,
  ...ownProps
});

const ResponsiveModal = ({isSmartphone, ...props}) => (
  <BareModal
    {...props}
    style={{margin: `${!isSmartphone ? '2.5rem' : ''} auto`}}
  />
);

export const ConnectedResponsiveModal = connect(
  mapStateToProps,
  null,
  mergeProps,
)(ResponsiveModal);

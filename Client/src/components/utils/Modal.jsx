import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import X from 'react-feather/dist/icons/x';

// import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

// const ddg = new DDG('tickle');

import {connect} from 'react-redux';

const reduxConnect = comp => {
  const mapStateToProps = state => ({
    topMargin: state.Screen.isSmartphone
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps
  });

  return connect(
    mapStateToProps,
    mergeProps
  )(comp);
};

export const BlackModal = reduxConnect(
  ({visible, topMargin, style, className, ...props}) =>
    ReactDOM.createPortal(
      <div
        className="fixed w-screen h-screen"
        style={{
          zIndex: 1000, // visible ? 1000 : -1000,
          pointerEvents: !visible ? 'none' : null,
          top: 0,
          left: 0,
          background: chroma('black')
            .alpha(0.3)
            .css(),
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s'
        }}>
        <InlineModal
          className={className}
          visible={visible}
          topMargin={topMargin}
          style={style}
          {...props}
        />
      </div>,
      BODY
    )
);

const BODY = document.querySelector('#modals');

export const InlineModal = ({
  visible,
  title,
  children,
  onClose,
  style,
  className,
  topMargin
  // background,
}) => (
  <div
    className={`absolute ${className}`}
    style={{
      zIndex: visible ? 1000 : -1000,
      pointerEvents: !visible ? 'none' : null,
      opacity: visible ? 1 : 0,
      left: 0,
      top: visible ? 0 : '200vh',
      right: 0,
      bottom: 0,
      transition: 'top 0.4s'
    }}>
    <div
      className="h-full w-full"
      style={{
        maxWidth: 500,
        maxHeight: 800,
        margin: `${topMargin ? '2.5rem' : ''} auto`,
        ...style
      }}>
      {children}
    </div>
  </div>
);

InlineModal.defaultProps = {
  className: ''
};

export const Modal = reduxConnect(props =>
  ReactDOM.createPortal(<InlineModal {...props} />, BODY)
);

// TODO: fix padding bottom
// TODO: access child state
export const ModalBody = ({
  children,
  footer,
  style,
  title,
  className,
  onClose
}) => (
  <div
    className={`modal-content h-full flex flex-col bg-white ${className}`}
    style={{
      // height: '100%',
      margin: 'auto', // margin: '1.75rem auto',
      transform: 'translate(0, 0)',
      minHeight: 500,
      maxWidth: 500,
      maxHeight: 800,
      boxShadow: 'black 0.2rem 0.2rem',
      ...style
    }}>
    <div className="flex justify-between items-center p-4 flex-no-shrink">
      <h2 className="capitalize">{title}</h2>
      <button className="btn thick-border" onClick={onClose}>
        <X />
      </button>
    </div>
    <div
      className="flex flex-col pb-4 px-4 flex-grow overflow-y-auto"
      style={
        {
          // flex: '1 1 auto',
          // paddingTop: '1rem',
          // paddingLeft: '1rem',
          // paddingRight: '1rem'
        }
      }>
      {children}
    </div>
    {footer && (
      <div className="modal-footer flex justify-end flex-no-shrink p-4">
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
  mergeProps
)(ResponsiveModal);

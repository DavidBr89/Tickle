import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import { css } from 'aphrodite/no-important';
import * as Icon from 'react-feather';

import { connect } from 'react-redux';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
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
    className="modal-dialog"
    style={{
      width: '100%',
      // height: '100%',
      opacity: visible ? 1 : 0,
      transition: 'opacity 1s',
      zIndex: visible ? 30000 : -10,
      margin: 'auto',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      position: 'fixed'
    }}
  >
    {children}
  </div>
);

export const BareModal = props =>
  ReactDOM.createPortal(
    <InlineModal {...props} />,
    document.querySelector('body')
  );

export const PureModal = ({
  visible,
  children,
  style,
  uiColor,
  width,
  height
  // background,
}) =>
  ReactDOM.createPortal(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s',
        zIndex: visible ? '100000' : '-10',
        left: 0,
        top: 0,
        right: 0,
        position: 'fixed'
      }}
    >
      <div
        className="modal fade show"
        style={{
          opacity: visible ? 1 : 0,
          display: visible ? 'block' : 'none',
          width: '100%',
          height: '100%'
        }}
      >
        <div
          style={{
            height: '100%',
            margin: 'auto', // margin: '1.75rem auto',
            transform: 'translate(0, 0)',
            maxWidth: 500,
            maxHeight: 800,
            ...style
          }}
        >
          <div
            className="modal-content"
            style={{
              width: '100%',
              height: '100%',
              maxWidth: 500,
              maxHeight: 800,
              overflow: 'hidden'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('body')
  );

PureModal.propTypes = {
  visible: PropTypes.bool,
  background: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  style: PropTypes.object,
  uiColor: PropTypes.object,
  footer: PropTypes.oneOf([PropTypes.node, null])
};

PureModal.defaultProps = {
  visible: true,
  title: null,
  children: <div>test</div>,
  onClose: () => null,
  onSave: () => null,
  style: {},
  background: 'green',
  uiColor: defaultUiColor,
  footer: null
};

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
  <React.Fragment>
    <div
      style={{
        padding: '1rem',
        borderBottom: `1px solid ${uiColor}`,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }}
    >
      <h3 className="modal-title">{title}</h3>
      <button className={css(stylesheet.btn)} onClick={onClose}>
        <Icon.X />
      </button>
    </div>
    <div
      className="flexCol flex-100"
      style={{
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
          padding: '1rem'
        }}
      >
        {footer}
      </div>
    )}
  </React.Fragment>
);

const mapStateToProps = state => ({ ...state.Screen });
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps
});

export const Modal = connect(
  mapStateToProps,
  null,
  mergeProps
)(PureModal);

export const StyledModalBody = ({ children, ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet }) => (
      <ModalBody stylesheet={stylesheet} {...props}>
        {children}
      </ModalBody>
    )}
  </CardThemeConsumer>
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

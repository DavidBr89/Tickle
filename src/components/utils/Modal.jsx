import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import { css } from 'aphrodite/no-important';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
import {
  stylesheet as defaultStylesheet,
  uiColor as defaultUiColor
} from 'Src/styles/GlobalThemeContext';

// const ddg = new DDG('tickle');

export const BareModal = ({
  visible,
  title,
  children,
  onClose,
  style,
  uiColor
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
        position: 'absolute'
      }}
    >
      <div className="modal-dialog" style={{ height: '100%', style }}>
        {children}
      </div>
    </div>,
    document.querySelector('body')
  );

export const Modal = ({
  visible,
  title,
  children,
  onClose,
  style,
  uiColor
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
        position: 'absolute'
      }}
    >
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{
          opacity: visible ? 1 : 0,
          display: visible ? 'block' : 'none',
          width: '100%',
          height: '100%'
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={{
            height: '97.5vh',
            maxHeight: 800
          }}
        >
          <div
            className="modal-content"
            style={{
              width: '100%',
              height: '100%',
              // TODO: fix later
              // TODO: fix later
              // TODO: fix later
              // TODO: fix later CONSTANT
              ...style
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('body')
  );

Modal.propTypes = {
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

Modal.defaultProps = {
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
      className="modal-header"
      style={{ borderBottom: `1px solid ${uiColor}` }}
    >
      <h3 className="modal-title" id="exampleModalLabel">
        {title}
      </h3>
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
        onClick={onClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body" style={{ height: '70%', ...style }}>
      {children}
    </div>

    <div className={css(stylesheet.modalFooter)}>{footer}</div>
  </React.Fragment>
);

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

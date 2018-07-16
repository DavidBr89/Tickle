import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import { css } from 'aphrodite/no-important';

import { ThemeConsumer } from 'Src/styles/ThemeContext';

// const ddg = new DDG('tickle');

const Modal = ({
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
        // height: '90vh',
        // overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s',
        zIndex: visible ? '100000' : '-10',
        left: 0,
        top: 0,
        position: 'absolute'
        // maxWidth: width,
        // maxHeight: height
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
          height: '100%',
          ...style
        }}
      >
        <div className="modal-dialog" role="document">
          <div
            className={`modal-content ${!title && 'pb-2 pt-2'}`}
            style={
              {
                // TODO: why to check
                // background:
                //   uiColor &&
                //   chroma(uiColor)
                //     .brighten(1.6)
                //     .desaturate(0.6)
              }
            }
          >
            {title ? (
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
            ) : (
              <div
                style={{
                  position: 'absolute',
                  zIndex: '8000',
                  right: 10,
                  top: 10
                }}
              >
                <button
                  type="button"
                  className="close "
                  style={{ width: '20px', height: '20px' }}
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
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
  uiColor: 'grey',
  footer: null
};

// TODO: fix padding bottom
// TODO: access child state
const ModalBody = ({ children, footer, styles }) => (
  <ThemeConsumer>
    {({ stylesheet }) => (
      <div
        style={{
          width: '100%',
          // height: '90%',
          // TODO: outsource
          maxHeight: 800,
          // height: '100%',
          // height: '30vh',
          overflow: 'hidden',

          ...styles
        }}
      >
        <div className="modal-body">{children}</div>

        <div className={css(stylesheet.modalFooter)}>{footer}</div>
      </div>
    )}
  </ThemeConsumer>
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

export { Modal, ModalBody };

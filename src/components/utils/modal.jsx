import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

// const ddg = new DDG('tickle');

const Modal = ({
  visible,
  title,
  children,
  onClose,
  style,
  // background,
  uiColor
}) =>
  ReactDOM.createPortal(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s',
        zIndex: visible ? '6000' : '-10',
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
          ...style
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className={`modal-content ${!title ? 'pb-2 pt-2' : null}`}
            style={{
              // TODO: why to check
              background:
                uiColor &&
                chroma(uiColor)
                  .brighten(1.6)
                  .desaturate(0.6)
            }}
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
  style: PropTypes.object
};
Modal.defaultProps = {
  visible: true,
  title: null,
  children: <div>{'test'}</div>,
  onClose: () => null,
  onSave: () => null,
  style: {},
  background: 'green'
};

// TODO: fix padding bottom
const ModalBody = ({ children, onSubmit, submitText, uiColor }) => (
  <div>
    <div className="modal-body">{children}</div>
    <div
      className="modal-footer"
      style={{
        paddingBottom: !onSubmit ? '50px' : null,
        borderTop: `1px solid ${uiColor}`
      }}
    >
      {onSubmit && (
        <button
          type="button"
          className="btn btn-primary"
          style={{ background: uiColor }}
          onClick={onSubmit}
        >
          {submitText}
        </button>
      )}
    </div>
  </div>
);

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  submitText: PropTypes.text,
  uiColor: PropTypes.oneOf([PropTypes.string, null])
  // background: PropTypes.string
};

ModalBody.defaultProps = {
  onSubmit: null,
  submitText: 'Save Changes',
  uiColor: 'black'
};

export { Modal, ModalBody };

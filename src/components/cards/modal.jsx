import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// const ddg = new DDG('tickle');

const SmallModal = ({ visible, title, children, onClose }) =>
  ReactDOM.createPortal(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s',
        zIndex: visible ? '4000' : '-10',
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
          display: visible ? 'block' : 'none'
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {title}
              </h5>
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
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('body')
  );

SmallModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};
SmallModal.defaultProps = {
  visible: true,
  title: '-',
  children: <div>{'test'}</div>,
  onClose: () => null,
  onSave: () => null
};

const ModalBody = ({ children, onSubmit, submitText }) => (
  <div>
    <div className="modal-body">{children}</div>
    <div
      className="modal-footer"
      style={{ paddingBottom: !onSubmit ? '50px' : null }}
    >
      {onSubmit && (
        <button type="button" className="btn btn-primary" onClick={onSubmit}>
          {submitText}
        </button>
      )}
    </div>
  </div>
);

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  submitText: PropTypes.text
};

ModalBody.defaultProps = {
  onSubmit: null,
  submitText: 'Save Changes'
};

export { SmallModal, ModalBody, MediaSearch, SearchOverview };

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ControlPanel extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  };

  defaultProps = {
    className: '',
    style: {}
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <button className="btn mb-2"> difficulty</button>
        <button
          className={`btn mb-3 mr-3 ml-2 ${dataView === 'topic' &&
            'btn-active'}`}
          style={{
            // position: 'absolute',
            zIndex: 1000
            // background: dataView === 'som' && 'grey',
          }}
          onClick={() => setDataView('topic')}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 30
            }}
          >
            <div style={{ fontWeight: 'bold' }}>Topic</div>
          </div>
        </button>
      </div>
    );
  }
}

export default ControlPanel;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FilterPanel extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  static defaultProps = { data: [] };

  state = { data: this.props.data, curKey: null };

  removeItem = key => {
    this.setState(({ data: oldData }) => ({
      data: oldData.filter(k => key !== k)
    }));
  };

  addItem = key => {
    this.setState(({ data: oldData }) => ({
      data: [key, ...oldData],
      curKey: null
    }));
  };
  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { data } = this.state;
    if (prevState.data.length !== data.length) {
      onChange(data);
    }
  }

  render() {
    const { onClick } = this.props;
    const { data, curKey } = this.state;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            overflow: 'hidden',
            padding: 5,
            width: 300,
            display: 'flex',
            flexWrap: 'no-wrap',
            position: 'relative',
            zIndex: 2000
          }}
        >
          <input
            type="text"
            placeholder="Add Tag"
            value={curKey || ''}
            onChange={event => this.setState({ curKey: event.target.value })}
            style={{
              position: 'relative',
              zIndex: 1000,
              background: 'transparent',
              border: 0,
              color: '#777',
              outline: 'none',
              padding: 5,
              width: 80
            }}
          />
          <div
            style={{
              display: 'flex',
              flexWrap: 'no-wrap'
            }}
          >
            {data.map(key => (
              <span
                className="btn mr-2"
                style={{
                  position: 'relative',
                  zIndex: 4000
                }}
                onClick={() => this.removeItem(key)}
              >
                <strong>{key}</strong>
                <span> x</span>
              </span>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', right: 0, zIndex: 1000 }}>
          <button
            className="btn ml-2 mr-2"
            type="button"
            onClick={() => this.addItem(curKey)}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}

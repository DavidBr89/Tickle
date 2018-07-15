import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoUpload from 'Utils/PhotoUpload';

class AddUrl extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { imgUrl: null, ...this.props };

  render() {
    const {
      uiColor = 'grey',
      onChange,
      style = {},
      className = ''
    } = this.props;

    const { imgUrl } = this.state;

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', ...style }}
      >
        <div
          style={{
            overflow: 'hidden',
            height: '100%'
          }}
        >
          <div
            style={{
              // TODO: outsource
              height: '100%',
              width: '100%',
              // minHeight: 80,
              border: `dashed 3px ${uiColor}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {imgUrl ? (
              <div
                style={{
                  overflow: 'hidden',
                  width: '100%',
                  height: 300
                  // height: this.contHeight
                }}
              >
                <img src={imgUrl} width="100%" alt={imgUrl} />
              </div>
            ) : (
              <h1
                className="pl-2 pr-2"
                style={{ background: uiColor, color: 'black', margin: '20%' }}
              >
                {'No Image'}
              </h1>
            )}
          </div>
          <div className="mt-3">
            <input
              className="mr-1"
              value={imgUrl}
              placeholder="add url"
              style={{ border: `${uiColor} 1px solid` }}
              type="url"
              onChange={e => this.setState({ imgUrl: e.target.value })}
            />
            <button
              className="btn"
              onClick={() => {
                onChange({
                  url: imgUrl
                });
              }}
            >
              Add Url
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class Nav extends React.Component {
  static propTypes = {
    children: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
    className: PropTypes.string,
    keys: PropTypes.array,
    preSelected: PropTypes.string,
    onChange: PropTypes.func,
    uiColor: PropTypes.string
  };

  static defaultProps = {
    className: '',
    keys: ['1', '2', '3'],
    uiColor: 'black',
    children: d => d,
    preSelected: 'PhotoUpload',
    onChange: d => d
  };

  state = { selected: this.props.preSelected };

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    if (selected !== prevState.selected) {
      this.props.onChange(selected);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }

  render() {
    const { keys, children, uiColor } = this.props;
    const { selected } = this.state;

    const btnStyle = sel => ({
      background: sel === selected ? uiColor : 'whitesmoke',
      display: 'inline-flex',
      color: sel === selected ? 'white' : null,
      width: '30%',
      overflow: 'hidden'
      // textOverflow: 'ellipsis'
    });

    const updState = sel => () => this.setState({ selected: sel });

    return (
      <div style={{ width: '100%' }}>
        <div
          className="mb-3 nav"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'no-wrap'
          }}
          role="tablist"
        >
          {keys.map(key => (
            <button
              className="btn"
              type="button"
              onClick={updState(key)}
              style={btnStyle(selected)}
              id={key}
            >
              <div
                style={{
                  // TODO: does not work
                  textOverflow: 'ellipsis'
                }}
              >
                {key}
              </div>
            </button>
          ))}
        </div>
        <div className="tab-content">
          <div className="w-100 h-100" role="tabpanel">
            {children(selected)}
          </div>
        </div>
      </div>
    );
  }
}

class EditPhoto extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  renderSelected = key => {
    switch (key) {
      case 'Upload Photo': {
        return <PhotoUpload {...this.props} />;
      }
      case 'Url':
        return <AddUrl {...this.props} />;
    }
  };

  render() {
    const { uiColor } = this.props;
    return (
      <div>
        <Nav
          uiColor={uiColor}
          preSelected="Url"
          keys={['Upload Photo', 'Url']}
        >
          {selected => this.renderSelected(selected)}
        </Nav>
      </div>
    );
  }
}

export default EditPhoto;

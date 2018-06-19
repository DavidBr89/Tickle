import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';

import { scaleOrdinal } from 'd3';

import MapAreaRadius from '../utils/map-layers/MapAreaRadius';
import CardMarker from './CardMarker';
import { DivOverlay, UserOverlay } from '../utils/map-layers/DivOverlay';

class DimWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;
    this.setState({ width, height });
  }

  componentDidUpdate(prevProps) {
    if (this.props.extended !== prevProps.extended) {
      const width = this.node.offsetWidth;
      const height = this.node.offsetHeight;
      this.setState({ width, height });
    }
  }

  render() {
    const { children } = this.props;
    const { width, height } = this.state;
    return (
      <div
        ref={node => (this.node = node)}
        style={{ height: '100%', width: '100%' }}
      >
        {children(width, height)}
      </div>
    );
  }
}

function MapAreaForm({ ...props }) {
  const {
    style,
    className,
    onChange,
    scaleRad,
    uiColor,
    selectedRadius
  } = props;
  const isSelected = d => scaleRad(d) === selectedRadius;

  const btnStyle = d => ({
    border: '1px solid black',
    background: isSelected(d) ? uiColor : null
    // borderRadius: '50%',
    // height: '30px',
    // width: '30px'
  });
  const changeHandler = m => () => onChange(m);

  return (
    <div
      className={className}
      style={{
        height: '100%',
        width: '25%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        ...style
        // marginTop: '40px'
      }}
    >
      {scaleRad.domain().map(d => (
        <button
          className={`btn ${isSelected(d) ? 'btn-active' : null}`}
          style={btnStyle(d)}
          onClick={changeHandler(scaleRad(d))}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

MapAreaForm.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  selectedRadius: PropTypes.number,
  scaleRad: PropTypes.func,
  uiColor: PropTypes.string
};

MapAreaForm.defaultProps = {
  style: {},
  className: '',
  onChange: d => d,
  selectedRadius: 100,
  uiColor: 'black',
  scaleRad: scaleOrdinal()
    .domain(['100m', '1km', '5km', '10km'])
    .range([100, 1000, 5000, 10000])
};

class MapAreaControl extends Component {
  static propTypes = {
    radius: PropTypes.number,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    extended: PropTypes.bool,
    onClose: PropTypes.func,
    uiColor: PropTypes.string,
    onChange: PropTypes.func,
    edit: PropTypes.bool,
    markerHeight: PropTypes.number,
    markerWidth: PropTypes.number
  };

  static defaultProps = {
    radius: 100,
    extended: false,
    onClose: d => d,
    uiColor: 'black',
    onChange: d => d,
    edit: false,
    markerHeight: 40,
    markerWidth: 30
  };

  constructor(props) {
    super(props);
    const { latitude, longitude, radius } = props;
    this.state = { userLocation: { latitude: 0, longitude: 0 }, radius };
  }

  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { radius } = this.state;
    // TODO: why prevState
    // if (!prevState.extended) onChange(radius);
  }

  // componentDidMount() {
  //   navigator.geolocation.getCurrentPosition(pos => {
  //     this.setState({
  //       userLocation: {
  //         latitude: pos.coords.latitude,
  //         longitude: pos.coords.longitude
  //       }
  //     });
  //   });
  // }

  render() {
    const {
      latitude,
      longitude,
      extended,
      onClose,
      uiColor,
      edit,
      markerWidth,
      markerHeight,
      loc
    } = this.props;

    const { userLocation, radius } = this.state;
    const radRange = [100, 1000, 5000, 10000];
    const scaleRad = scaleOrdinal()
      .domain(radRange.map(d => `${d}m`))
      .range(radRange);

    const scaleZoom = scaleOrdinal()
      .domain(radRange)
      .range([16, 13.5, 11, 10]);

    const mapViewport = (width, height) => ({
      width,
      height,
      latitude,
      longitude,
      zoom: scaleZoom(radius)
    });

    // {extended && (
    //   <div
    //     style={{
    //       position: 'absolute',
    //       zIndex: 2000,
    //       right: 0
    //     }}
    //   >
    //     {edit && (
    //       <div style={{ height, width }}>
    //         <MapAreaForm
    //           className="ml-3"
    //           width={width}
    //           height={height}
    //           selectedRadius={radius}
    //           uiColor={uiColor}
    //           scaleRad={scaleRad}
    //           onChange={r => this.setState({ radius: r })}
    //         />
    //       </div>
    //     )}
    //   </div>
    // )}

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div style={{ height: '100%', width: '100%' }}>
          <DimWrapper extended={extended}>
            {(width, height) => (
              <MapGL {...mapViewport(width, height)}>
                <MapAreaRadius
                  userLocation={userLocation}
                  mapViewport={mapViewport(width, height)}
                  cardPosition={{ ...loc }}
                  radius={radius}
                />
                <DivOverlay {...mapViewport(width, height)} data={[{ loc }]}>
                  {(_, [left, top]) => (
                    <div
                      style={{
                        position: 'absolute',
                        left: left - markerWidth / 2,
                        top: top - markerHeight / 2,
                        width: markerWidth,
                        height: markerHeight
                      }}
                    >
                      <CardMarker />
                    </div>
                  )}
                </DivOverlay>
              </MapGL>
            )}
          </DimWrapper>
        </div>
      </div>
    );
  }
}
export { MapAreaControl };

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';

// TODO remove
import DimWrapper from 'Utils/DimensionsWrapper';
// import { geoProject } from 'Lib/geo';
import CardMarker from 'Components/cards/CardMarker';
// import MapAreaRadius from '../../utils/map-layers/MapAreaRadius';


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
    markerWidth: 30,
    loc: {
      latitude: 0,
      longitude: 0
    }
  };

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

    const mapViewport = (width, height) => ({
      width,
      height,
      ...loc,
      zoom: 14
    });

    // const [locNode] = geoProject({});

    return (
      <div className="absolute w-full h-full">
        <DimWrapper delay={100}>
          {(width, height) => (<div className="relative">

            <MapGL {...mapViewport(width, height)} />
            <CardMarker
              className="absolute"
              style={{
                left: width / 2, top: height / 2, width: 35, height: 45
              }}
            />

                               </div>)
          }
        </DimWrapper>
      </div>
    );
  }
}

/*
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
              */

export { MapAreaControl };

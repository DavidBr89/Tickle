import 'react-rangeslider/lib/index.css';

import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';

import { scaleOrdinal } from 'd3';
import { shallowEqualProps } from 'shallow-equal-props';

import cx from './Card.scss';

import { FieldSet, Comments, PreviewMedia, FlipButton } from './layout';
import CardHeader from './CardHeader';
import { Wrapper } from '../utils';
import MapAreaRadius from '../utils/map-layers/MapAreaRadius';
import { UserOverlay } from '../utils/map-layers/DivOverlay';
import Author from './Author';

const DeleteButton = ({ style, onClick, color, className }) => (
  <button
    className={`btn ${className}`}
    style={{
      background: color,
      color: 'whitesmoke',
      ...style
    }}
    onClick={onClick}
  >
    <i className="fa fa-trash fa-2x" aria-hidden="true" />
  </button>
);

DeleteButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string
};
DeleteButton.defaultProps = {
  style: {},
  onClick: d => d,
  color: 'black',
  className: ''
};

class RadiusSwitch extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      style,
      className,
      onChange,
      scaleRad,
      uiColor,
      selectedRadius
    } = this.props;

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
}
RadiusSwitch.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  selectedRadius: PropTypes.number,
  scaleRad: PropTypes.func,
  uiColor: PropTypes.string
};

RadiusSwitch.defaultProps = {
  style: {},
  className: '',
  onChange: d => d,
  selectedRadius: 100,
  uiColor: 'black',
  scaleRad: scaleOrdinal()
    .domain(['100m', '1km', '5km', '10km'])
    .range([100, 1000, 5000, 10000])
};

class MapRadiusEditor extends PureComponent {
  static propTypes = {
    radius: PropTypes.number,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    extended: PropTypes.bool,
    onClose: PropTypes.func,
    uiColor: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    radius: 100,
    extended: false,
    onClose: d => d,
    uiColor: 'black',
    onChange: d => d
  };

  constructor(props) {
    super(props);
    const { latitude, longitude, radius } = props;
    this.state = { userLocation: { latitude, longitude }, radius };
  }

  componentDidUpdate(prevProps, prevState) {
    const { extended, onChange } = this.props;
    const { radius } = this.state;
    console.log('update small', !extended, prevState.radius, radius);
    if (!prevState.extended) onChange(radius);
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
      flipHandler
    } = this.props;
    const { userLocation, radius } = this.state;
    const radRange = [100, 1000, 5000, 10000];
    const scaleRad = scaleOrdinal()
      .domain(['100m', '1km', '5km', '10km'])
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

    return (
      <Wrapper extended={extended}>
        {(width, height) => (
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              // transition: 'all 1s ease-out',
              position: 'relative'
            }}
          >
            {extended && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 2000,
                  right: 0,
                  bottom: 0
                }}
              >
                <button
                  className="btn mr-2 mt-1"
                  style={{ float: 'right', padding: '2px 6px' }}
                  onClick={onClose}
                >
                  <i className="fa fa-2x fa-minus-square" />
                </button>

                <div style={{ height, width }}>
                  <RadiusSwitch
                    className="ml-3"
                    width={width}
                    height={height}
                    selectedRadius={radius}
                    uiColor={uiColor}
                    scaleRad={scaleRad}
                    onChange={r => this.setState({ radius: r })}
                  />
                </div>
              </div>
            )}

            <MapGL {...mapViewport(width, height)}>
              <MapAreaRadius
                userLocation={userLocation}
                mapViewport={mapViewport(width, height)}
                cardPosition={{ latitude, longitude }}
                radius={radius}
              />
              <UserOverlay
                {...mapViewport(width, height)}
                location={userLocation}
              />
            </MapGL>
          </div>
        )}
      </Wrapper>
    );
  }
}

class CardBackSkeleton extends Component {
  static propTypes = {
    comments: PropTypes.array.isRequired,
    author: PropTypes.object.isRequired,
    flipHandler: PropTypes.func.isRequired,
    linkedCards: PropTypes.array,
    cardSets: PropTypes.array,
    loc: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    uiColor: PropTypes.string,
    edit: PropTypes.bool,
    mapRadius: PropTypes.number,
    setMapRadius: PropTypes.func,
    deleteHandler: PropTypes.func
  };

  static defaultProps = {
    linkedCards: [],
    loc: { latitude: 0, longitude: 0 },
    cardSets: [],
    uiColor: 'grey',
    edit: true,
    flipHandler: d => d,
    mapRadius: 100,
    setMapRadius: d => d,
    deleteHandler: d => d
  };

  constructor(props) {
    super(props);
    this.state = { extended: null };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.extended !== nextState.extended;
  }

  render() {
    const {
      loc,
      author,
      uiColor,
      comments,
      edit,
      setMapRadius,
      mapRadius,
      flipHandler,
      deleteHandler
    } = this.props;

    const { extended } = this.state;
    const selectField = field => () =>
      extended !== field && this.setState({ extended: field });
    const unSelectField = field => () =>
      extended === field && this.setState({ extended: null });

    const isHidden = field => extended !== null && extended !== field;
    const isExtended = field => ({ extended: extended === field });
    const display = field => ({
      display: isHidden(field) ? 'none' : null,
      height: extended === field ? '100%' : '29%'
      // opacity: field !== 'map' && edit ? 0.5 : null
    });

    return (
      <div
        ref={cont => (this.cont = cont)}
        className={`container ${cx.cardMini2} `}
        style={{
          height: '90%',
          zIndex: -10
        }}
      >
        <FieldSet
          legend={'Author'}
          color={uiColor}
          style={{ ...display('author') }}
          onClick={selectField('author')}
        >
          <Author
            {...author}
            extended={extended === 'author'}
            onClose={() => {
              // TODO
              // console.log('onCLose');
              // this.setState({ extended: null });
            }}
          />
        </FieldSet>
        <FieldSet
          style={{ width: '100%', ...display('map') }}
          edit={edit}
          legend={'Location'}
          color={uiColor}
          onClick={selectField('map')}
        >
          <MapRadiusEditor
            {...loc}
            {...isExtended('map')}
            onClose={unSelectField('map')}
            uiColor={uiColor}
            onChange={r => setMapRadius(r)}
            radius={mapRadius}
          />
        </FieldSet>
        <FieldSet
          onClick={selectField('comments')}
          legend={'Comments'}
          style={display('comments')}
          color={uiColor}
        >
          <Comments data={comments} />
        </FieldSet>
        <div
          className="mt-2"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {edit && (
            <DeleteButton
              onClick={deleteHandler}
              color={uiColor}
              style={{ width: '20%' }}
            />
          )}
          <FlipButton
            className="ml-2"
            color={uiColor}
            onClick={flipHandler}
            style={{ width: edit ? '20%' : '100%' }}
          />
        </div>
      </div>
    );
  }
}

const CardBack = props => (
  <CardHeader
    onClose={props.onClose}
    background={props.background}
    title={props.title}
    uiColor={props.uiColor}
  >
    <CardBackSkeleton {...props} />
  </CardHeader>
);

CardBack.propTypes = {
  flipHandler: PropTypes.func,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  background: PropTypes.string,
  uiColor: PropTypes.string,
  title: PropTypes.oneOf([PropTypes.string, null]),
  setMapRadius: PropTypes.func
};

CardBack.defaultProps = {
  flipHandler: d => d,
  edit: false,
  onClose: d => d,
  background: 'black',
  uiColor: 'black',
  title: null,
  setMapRadius: d => d
};

export default CardBack;

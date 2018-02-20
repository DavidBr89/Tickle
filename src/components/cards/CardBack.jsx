import 'react-rangeslider/lib/index.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';
import Slider from 'react-rangeslider';

import cx from './Card.scss';

import { FieldSet, Tags, Comments, PreviewMedia } from './layout';
import CardHeader from './CardHeader';
import { Wrapper } from '../utils';
import MapAreaRadius from '../utils/map-layers/MapAreaRadius';
import Author from './Author';

class RadiusSlider extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      horizontal: 10,
      vertical: 50
    };
  }
  render() {
    const { width, height, style, className } = this.props;
    const btnStyle = {
      border: '1px solid black'
      // borderRadius: '50%',
      // height: '30px',
      // width: '30px'
    };
    return (
      <div
        style={{
          height,
          width
        }}
      >
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
          <button className="btn" style={btnStyle}>
            Unlimited
          </button>
          <button className="btn" style={btnStyle}>
            5km
          </button>
          <button className="btn" style={btnStyle}>
            1km
          </button>
          <button className="btn" style={btnStyle}>
            100m
          </button>
        </div>
      </div>
    );
  }
}
RadiusSlider.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string
};

RadiusSlider.defaultProps = {
  style: {},
  className: ''
};

class MapRadiusEditor extends Component {
  static propTypes = {
    radius: PropTypes.number,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    extended: PropTypes.bool,
    onClose: PropTypes.func
  };

  static defaultProps = {
    radius: 500,
    extended: false,
    onClose: d => d
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { latitude, longitude, extended, onClose } = this.props;

    return (
      <Wrapper extended={extended}>
        {(width, height) => (
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transition: 'all 1s ease-out',
              position: 'relative'
            }}
          >
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
                style={{ float: 'right' }}
                onClick={onClose}
              >
                <i className="fa fa-2x fa-undo" />
              </button>
              <RadiusSlider width={width} height={height} className="ml-3" />
            </div>
            <MapGL
              width={width}
              height={height}
              latitude={latitude}
              longitude={longitude}
              zoom={8}
            />
          </div>
        )}
      </Wrapper>
    );
  }
}

class ReadCardBack extends Component {
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
    edit: PropTypes.bool
  };

  static defaultProps = {
    linkedCards: [],
    loc: { latitude: 0, longitude: 0 },
    cardSets: [],
    uiColor: 'grey',
    edit: true
  };

  constructor(props) {
    super(props);
    this.state = { extended: null };
  }

  render() {
    const { loc, author, uiColor, comments, edit } = this.props;

    console.log('cardback', this.props);

    const { extended } = this.state;
    const selectField = field => () =>
      extended !== field && this.setState({ extended: field });
    const unSelectField = field => () =>
      extended === field && this.setState({ extended: null });

    const isHidden = field => extended !== null && extended !== field;
    const isExtended = field => ({ extended: extended === field });
    const display = field => ({
      display: isHidden(field) ? 'none' : null,
      height: extended === field ? '100%' : '30%'
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
          legend={'Map radius'}
          color={uiColor}
          onClick={selectField('map')}
        >
          <MapRadiusEditor
            {...loc}
            {...isExtended('map')}
            node={this.cont}
            onClose={unSelectField('map')}
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
      </div>
    );
  }
}

ReadCardBack.defaultProps = {
  challenge: { type: '0' },
  comments: Comments.defaultProps.data,
  media: PreviewMedia.defaultProps.data,
  cardSets: ['testseries', 'pirateSet'],
  linkedCards: ['Captain hook', 'yeah'],
  loc: { latitude: 0, longitude: 0 },
  author: {}
};

// <FieldSet
// onClick={selectField('cardSets')}
// style={{ ...display('cardSets') }}
// legend={'CardSets'}
// color={uiColor}
// >
// <Tags data={cardSets} />
// </FieldSet>
// <FieldSet
// onClick={selectField('linkedCards')}
// legend={'linkedCards'}
// style={display('linkedCards')}
// color={uiColor}
// >
// <div>
// <Tags data={linkedCards} />
// </div>
// </FieldSet>

// class EditCardBack extends Component {
//   static propTypes = {
//     key: PropTypes.string.isRequired,
//     challenge: PropTypes.object.isRequired,
//     author: PropTypes.object.isRequired,
//     flipHandler: PropTypes.func.isRequired,
//     cardSets: PropTypes.object.isRequired,
//     linkedCards: PropTypes.object.isRequireds,
//     loc: PropTypes.shape({
//       latitude: PropTypes.number,
//       longitude: PropTypes.number
//     }),
//     media: PropTypes.array.isRequired
//   };
//
//   constructor(props) {
//     super(props);
//     this.state = { extended: null };
//   }
//
//   render() {
//     const { challenge, media, loc, uiColor } = this.props;
//     const { extended } = this.state;
//     const selectField = field => () =>
//       this.setState(prevstate => ({
//         extended: prevstate.extended !== field ? field : null
//       }));
//
//     const setSizeProps = field => {
//       if (field === extended)
//         return {
//           colSpan: 2,
//           rowSpan: 3
//         };
//       return {};
//     };
//     const isHidden = field => extended !== null && extended !== field;
//     const display = field => ({
//       display: isHidden(field) ? 'none' : null
//     });
//
//     return (
//       <div
//         className={`container ${cx.cardMini2} `}
//         style={{
//           height: '90%',
//           zIndex: -10
//         }}
//       >
//           <div
//             onClick={selectField('author')}
//             style={display('author')}
//             {...setSizeProps('author')}
//           >
//             <FieldSet legend={'Author'} color={uiColor}>
//               <Author />
//             </FieldSet>
//           </div>
//           <div
//             onClick={selectField('map')}
//             style={display('map')}
//             {...setSizeProps('map')}
//           >
//             <FieldSet legend={'Map:'}>
//               <Wrapper>
//                 {(width, height) => (
//                   <MapGL
//                     width={width}
//                     height={height}
//                     latitude={loc.latitude}
//                     longitude={loc.longitude}
//                     zoom={8}
//                   />
//                 )}
//               </Wrapper>
//             </FieldSet>
//           </div>
//           <div
//             onClick={selectField('comments')}
//             colSpan={2}
//             style={display('comments')}
//             {...setSizeProps('comments')}
//           >
//             <FieldSet legend={'Comments'}>{'Placeholder'}</FieldSet>
//           </div>
//         </Grid>
//       </div>
//     );
//   }
// }

const CardBack = props => (
  <CardHeader
    flipHandler={props.flipHandler}
    onClose={props.onClose}
    background={props.background}
  >
    <ReadCardBack {...props} />
  </CardHeader>
);

CardBack.propTypes = {
  flipHandler: PropTypes.func,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  background: PropTypes.string
};

CardBack.defaultProps = {
  flipHandler: d => d,
  edit: false,
  onClose: d => d,
  background: 'black'
};

export default CardBack;

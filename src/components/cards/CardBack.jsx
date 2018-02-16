import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';

import cx from './Card.scss';

import { FieldSet, Tags, Comments, PreviewMedia } from './layout';
import CardHeader from './CardHeader';
import { Wrapper } from '../utils';
import Author from './Author';

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
    uiColor: PropTypes.string
  };

  static defaultProps = {
    linkedCards: [],
    loc: { latitude: 0, longitude: 0 },
    cardSets: [],
    uiColor: 'grey'
  };

  constructor(props) {
    super(props);
    this.state = { extended: null };
  }

  render() {
    const {
      cardSets,
      linkedCards,
      loc,
      author,
      uiColor,
      comments
    } = this.props;

    const { extended } = this.state;
    const selectField = field => () =>
      this.setState(prevstate => ({
        extended: prevstate.extended !== field ? field : null
      }));

    const isHidden = field => extended !== null && extended !== field;
    const display = field => ({
      display: isHidden(field) ? 'none' : null
    });

    return (
      <div
        className={`container ${cx.cardMini2} `}
        style={{
          height: '90%',
          zIndex: -10
        }}
      >
        <FieldSet
          legend={'Author'}
          color={uiColor}
          style={{ height: '20%', ...display('author') }}
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
          style={{ ...display('map'), height: '20%', width: '100%' }}
          legend={'Map radius'}
          color={uiColor}
          onClick={selectField('map')}
        >
          <Wrapper>
            {(width, height) => (
              <MapGL
                width={width}
                height={height}
                latitude={loc.latitude}
                longitude={loc.longitude}
                zoom={8}
              />
            )}
          </Wrapper>
        </FieldSet>
        <FieldSet
          onClick={selectField('cardSets')}
          style={{ ...display('cardSets')}}
          legend={'CardSets'}
          color={uiColor}
        >
          <Tags data={cardSets} />
        </FieldSet>
        <FieldSet
          onClick={selectField('linkedCards')}
          legend={'linkedCards'}
          style={display('linkedCards')}
          color={uiColor}
        >
          <div>
            <Tags data={linkedCards} />
          </div>
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

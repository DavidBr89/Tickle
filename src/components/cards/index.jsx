import 'w3-css';

import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

// import cxs from 'cxs';
// import ClampLines from 'react-clamp-lines';
// import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import cx from './Card.scss';
// import placeholderImg from './placeholder.png';
// TODO: rename
// import { Modal, ModalBody } from '../utils/modal';
// import { MediaSearch, MediaOverview } from './MediaSearch';
import CardBack from './CardBack';
import CardFront from './CardFront';

import PreviewCard from './PreviewCard';
import PlaceholderCard from './PlaceholderCard';
import CardMarker from './CardMarker';

import { colorScale } from './styles';

// ReadCardBack.defaultProps = {
//   key: 'asa',
//   comments: [
//     {
//       user: 'Nils',
//       img:
//         'https://placeholdit.imgix.net/~text?txtsize=6&txt=50%C3%9750&w=50&h=50',
//       comment: 'I did not know that he was such a famous composer',
//       date: '22/04/2016'
//     },
//     {
//       user: 'Babba',
//       comment: 'What a nice park, strange, that they put a mask on his face!',
//       date: '22/04/2016'
//     }
//   ],
//   author: { name: 'jan', comment: 'welcome to my super hard challenge!' }
// };


class Card extends React.Component {
  static propTypes = {
    onClose: PropTypes.oneOf([null, PropTypes.func]),
    collectHandler: PropTypes.oneOf([null, PropTypes.func]),
    style: PropTypes.object,
    edit: PropTypes.bool,
    challenge: PropTypes.object,
    onCollect: PropTypes.func,
    onAttrUpdate: PropTypes.func.isRequired
  };

  static defaultProps = {
    onClose: d => d,
    collectHandler: null,
    style: {},
    edit: false,
    challenge: { type: 'quiz' },
    onCollect: d => d,
    onAttrUpdate: d => d
  };

  constructor(props) {
    super(props);
    this.state = {
      frontView: true
    };
  }

  render() {
    const { style, edit, challenge, onAttrUpdate } = this.props;
    const { frontView } = this.state;
    // const { onClose } = this.props;
    const sideToggler = frontView ? cx.flipAnim : null;
    const { onCollect } = this.props;
    const flipHandler = () => {
      this.setState(oldState => ({
        frontView: !oldState.frontView
      }));
    };
    const background = colorScale(challenge.type);
    const uiColor = chroma(background).darken(1);

    const updateAttrFunc = { onAttrUpdate: edit ? onAttrUpdate : null };

    const togglecard = () => {
      if (frontView)
        return (
          <CardFront
            {...this.props}
            edit={edit}
            onCollect={onCollect}
            background={background}
            flipHandler={flipHandler}
            uiColor={uiColor}
            onAttrUpdate={onAttrUpdate}
            {...updateAttrFunc}
          />
        );
      return (
        <CardBack
          {...this.props}
          edit={edit}
          background={background}
          uiColor={uiColor}
          onCollect={onCollect}
          flipHandler={flipHandler}
          setMapRadius={mapRadius => {
            onAttrUpdate({ ...this.props, mapRadius });
          }}
        />
      );
    };

    // console.log('ToggleCard', ToggleCard);

    return (
      <div className={`${cx.flipContainer} ${sideToggler}`} style={style}>
        <div
          className={`${cx.flipper} ${sideToggler}`}
          style={{
            background
          }}
        >
          {togglecard()}
        </div>
      </div>
    );
  }
}

export { Card, PreviewCard, PlaceholderCard, CardMarker };

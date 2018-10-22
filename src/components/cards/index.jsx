// import 'w3-css';

import React from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

// import { css } from 'aphrodite/no-important';

import CardBack from './CardBack';
import ReadCardFront from './CardFront/ReadCardFront';

import PreviewCard from './PreviewCard';
import CardMarker from './CardMarker';

import {colorScale} from './styles';

import {btnStyle} from 'Src/styles/helperStyles';

import flipperCx from './flipper.scss';

const Flipper = ({style, children, flipped, front, back}) => {
  const commonStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
  };
  return (
    <div
      className={`${flipperCx.flipContainer} ${flipped && flipperCx.flip}`}
    >
      <div className={`${flipperCx.flipper} ${flipped && flipperCx.flip}`}>
        <div className={flipperCx.front}>{front}</div>
        <div className={flipperCx.back}>{back}</div>
      </div>
    </div>
  );
};

class Card extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.oneOf([null, PropTypes.array]),
    description: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    onClose: PropTypes.oneOf([null, PropTypes.func]),
    collectHandler: PropTypes.oneOf([null, PropTypes.func]),
    style: PropTypes.object,
    edit: PropTypes.bool,
    onCollect: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    challenge: PropTypes.oneOf([
      null,
      PropTypes.shape({
        type: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string
      })
    ]),
    loc: PropTypes.oneOf([
      null,
      PropTypes.shape({
        longitude: PropTypes.number,
        latitude: PropTypes.number,
        radius: PropTypes.number
      })
    ]),
    author: PropTypes.object,
    tagColorScale: PropTypes.func
  };

  static defaultProps = {
    title: null,
    tags: null,
    description: null,
    // TODO: remove
    challenge: null,
    type: null,
    loc: {
      longitude: 0,
      latitude: 0,
      radius: 10
    },
    onClose: d => d,
    collectHandler: null,
    style: {},
    edit: false,
    onCollect: d => d,
    uiColor: 'grey',
    background: 'whitesmoke',
    onUpdate: d => d,
    tagColorScale: () => 'gold',
    author: {username: 'defaultUser', email: 'defaultEmail'},
    frontView: true,
    front: ReadCardFront
  };

  render() {
    const {
      style,
      edit,
      challenge,
      onUpdate,
      type,
      tagColorScale,
      onSubmit,
      author,
      background,
      uiColor,
      template,
      iOS,
      flipHandler,
      front
    } = this.props;
    // const { frontView } = this.state;
    const {onCollect, frontView} = this.props;

    return (
      <Flipper
        flipped={!frontView}
        front={React.cloneElement(front, {
          ...this.props,
          background,
          flipHandler,
          uiColor,
          tagColorScale,
          onUpdate,
        })}
        back={
          <CardBack
            {...this.props}
            visible={!frontView}
            style={{}}
            edit={edit && !template}
            background={background}
            uiColor={uiColor}
            flipHandler={flipHandler}
            tagColorScale={tagColorScale}
            author={author}
            onUpdate={comments => this.setState({comments})}
            setMapRadius={mapRadius =>
              // onUpdate({ ...this.props, mapRadius });
              null
            }
          />
        }
      />
    );
  }
}

export {Card, PreviewCard, CardMarker};

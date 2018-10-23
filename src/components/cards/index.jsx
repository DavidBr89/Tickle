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

import Flipper from 'Components/utils/Flipper';

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
    const {frontView} = this.props;
    const className = 'bg-white border-4 border-black flex flex-col';

    return (
      <Flipper
        flipped={!frontView}
        frontClassName="flex flex-col"
        front={React.cloneElement(front, {
          ...this.props,
          className,
          background,
          flipHandler,
          uiColor,
          tagColorScale,
          onUpdate,
        })}
        backClassName="flex flex-col h-full"
        back={
          <CardBack
            {...this.props}
            className={className}
            visible={!frontView}
            edit={edit && !template}
            background={background}
            flipHandler={flipHandler}
            tagColorScale={tagColorScale}
            author={author}
            onUpdate={comments => this.setState({comments})}
            setMapRadius={mapRadius => null}
          />
        }
      />
    );
  }
}

export {Card, PreviewCard, CardMarker};

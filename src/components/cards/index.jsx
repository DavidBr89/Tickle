// import 'w3-css';

import React from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import { css } from 'aphrodite/no-important';

import CardBack from './CardBack';
import CardFront from './CardFront';

import PreviewCard from './PreviewCard';
import CardMarker from './CardMarker';

import { colorScale } from './styles';

import { CardThemeProvider, makeStylesheet } from 'Src/styles/CardThemeContext';
import { btnStyle } from 'Src/styles/helperStyles';

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
    author: { username: 'defaultUser', email: 'defaultEmail' },
    frontView: true
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
      flipHandler
    } = this.props;
    // const { frontView } = this.state;
    const { onCollect, frontView } = this.props;

    const stylesheet = makeStylesheet({ uiColor, background });
    const { flipper, flipAnim, flipContainer } = stylesheet;
    // const { onClose } = this.props;
    // const flipHandler = () => {
    //   this.setState(oldState => ({
    //     frontView: !oldState.frontView
    //   }));
    // };
    // const background = colorScale(type);
    // const uiColor = chroma(background).darken(1);
    // const focusColor = chroma(background).darken(3);

    // TODO: remove
    const darkerUiColor = chroma(uiColor)
      .darken(1)
      .hex();

    // const iOS =
    //   !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    return (
      <div
        className={`${css(stylesheet.flipContainer)}`}
        style={{ ...style, maxWidth: 500, maxHeight: 800 }}
      >
        <div
          className={`${css(stylesheet.flipper)}`}
          style={{
            background,
            transform: !iOS && !frontView && `rotateY(180deg)`
          }}
        >
          <CardThemeProvider value={{ stylesheet, uiColor, darkerUiColor }}>
            <CardFront
              {...this.props}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
                height: '100%',
                pointerEvents: !frontView && 'none',
                zIndex: frontView ? 5000 : -10,
                // opacity: frontView ? 1 : 0,
                display: iOS && !frontView && 'none'
                // display: !frontView && 'none'
                // zIndex: frontView && 100
                // transformStyle: 'preserve-3d'
              }}
              edit={edit}
              background={background}
              flipHandler={flipHandler}
              uiColor={uiColor}
              tagColorScale={tagColorScale}
              onUpdate={onUpdate}
            />
            <CardBack
              {...this.props}
              visible={!frontView}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                backfaceVisibility: 'hidden',
                pointerEvents: frontView && 'none',
                display: iOS && frontView && 'none',
                zIndex: !frontView ? 5000 : -10,
                // zIndex: 100,
                // zIndex: !frontView && 4000,
                // transformStyle: 'preserve-3d',
                transform: !iOS && 'rotateY(180deg)'
              }}
              edit={edit && !template}
              background={background}
              uiColor={uiColor}
              flipHandler={flipHandler}
              tagColorScale={tagColorScale}
              author={author}
              onUpdate={comments => this.setState({ comments })}
              setMapRadius={mapRadius =>
                // onUpdate({ ...this.props, mapRadius });
                null
              }
            />
          </CardThemeProvider>
        </div>
      </div>
    );
  }
}

export { Card, PreviewCard, CardMarker };

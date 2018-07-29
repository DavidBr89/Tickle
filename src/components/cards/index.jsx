// import 'w3-css';

import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import { StyleSheet, css } from 'aphrodite/no-important';

import cx from './Card.scss';
import CardBack from './CardBack';
import CardFront from './CardFront';

import PreviewCard from './PreviewCard';
import CardMarker from './CardMarker';

import { colorScale } from './styles';

import { CardThemeProvider, makeStylesheet } from 'Src/styles/CardThemeContext';
import { btnStyle } from 'Src/styles/helperStyles';

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
    author: { username: 'defaultUser', email: 'defaultEmail' }
  };

  state = {
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
      template
    } = this.props;
    const { frontView } = this.state;
    const { onCollect } = this.props;

    const stylesheet = makeStylesheet({ uiColor, background });
    const { flipper, flipAnim, flipContainer } = stylesheet;
    // const { onClose } = this.props;
    const flipHandler = () => {
      this.setState(oldState => ({
        frontView: !oldState.frontView
      }));
    };
    // const background = colorScale(type);
    // const uiColor = chroma(background).darken(1);
    // const focusColor = chroma(background).darken(3);

    // TODO: remove
    const darkerUiColor = chroma(uiColor)
      .darken(1)
      .hex();

    return (
      <div
        className={`${css(stylesheet.flipContainer)}`}
        style={{ ...style, maxWidth: 500, maxHeight: 800 }}
      >
        <div
          className={`${css(stylesheet.flipper)} ${
            !frontView ? css(flipAnim) : null
          }`}
          style={{
            background
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
                transformStyle: 'preserve-3d'
              }}
              edit={edit}
              onCollect={onCollect}
              background={background}
              flipHandler={flipHandler}
              uiColor={uiColor}
              tagColorScale={tagColorScale}
              onUpdate={onUpdate}
            />
            <CardBack
              {...this.props}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(180deg)'
              }}
              edit={!template}
              background={background}
              uiColor={uiColor}
              onCollect={onCollect}
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

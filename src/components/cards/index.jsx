// import 'w3-css';

import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import { StyleSheet } from 'aphrodite/no-important';

import cx from './Card.scss';
import CardBack from './CardBack';
import CardFront from './CardFront';

import PreviewCard from './PreviewCard';
import CardMarker from './CardMarker';

import { colorScale } from './styles';

import { CardThemeProvider, btnStyle } from 'Src/styles/CardThemeContext';

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
    onUpdate: d => d,
    tagColorScale: () => 'gold',
    author: { username: 'defaultUser', email: 'defaultEmail' }
  };

  state = {
    frontView: true
  };

  makeStylesheet = () => {
    const { uiColor, background } = this.props;

    const shallowBg = chroma(uiColor)
      .brighten(2.2)
      .hex();

    const littleShallowColor = chroma(uiColor)
      .brighten(1.2)
      .hex();

    const extraShallowBg = chroma(uiColor)
      .brighten(2.3)
      .hex();

    return StyleSheet.create({
      boxShadow: { boxShadow: `4px 4px ${uiColor}` },
      border: { border: `1px solid ${uiColor}` },
      bigBoxShadow: {
        border: `1px solid ${littleShallowColor}`,
        boxShadow: `6px 6px ${littleShallowColor}`
      },
      btn: {
        ...btnStyle,
        borderColor: uiColor,
        background: shallowBg,
        ':hover': {
          boxShadow: `4px 4px ${uiColor}`
        }
      },
      shallowBg: {
        background: shallowBg
      },
      extraShallowBg: {
        background: extraShallowBg
      },
      btnActive: {
        ...btnStyle,
        background: uiColor,
        color: 'whitesmoke',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center'
        // borderColor: uiColor
      },
      fieldSetBorder: {
        border: `${chroma(uiColor)
          .brighten(1.8)
          .hex()} solid 1px`
      },
      fieldSetLegend: {
        ':hover': {
          boxShadow: `4px 4px ${uiColor}`
        }
      },
      background: { background },
      modalFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '1rem',
        borderTop: `1px solid ${uiColor}`
      }
    });
  };

  // componentDidMount() {
  //   const { uid } = this.props;
  //   db.getUserInfo(uid).then(usr => console.log('yeah', usr));
  // }
  //
  //
  //

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
    // const { onClose } = this.props;
    const sideToggler = frontView ? cx.flipAnim : null;
    const { onCollect } = this.props;
    const flipHandler = () => {
      this.setState(oldState => ({
        frontView: !oldState.frontView
      }));
    };
    // const background = colorScale(type);
    // const uiColor = chroma(background).darken(1);
    // const focusColor = chroma(background).darken(3);
    const stylesheet = this.makeStylesheet();

    const darkerUiColor = chroma(uiColor)
      .darken(1)
      .hex();

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
            tagColorScale={tagColorScale}
            onUpdate={onUpdate}
          />
        );
      return (
        <CardBack
          {...this.props}
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
      );
    };

    // console.log('ToggleCard', ToggleCard);

    return (
      <div
        className={`${cx.flipContainer} ${sideToggler}`}
        style={{ ...style, maxWidth: 500, maxHeight: 800 }}
      >
        <div
          className={`${cx.flipper} ${sideToggler}`}
          style={{
            background
          }}
        >
          <CardThemeProvider value={{ stylesheet, uiColor, darkerUiColor }}>
            {togglecard()}
          </CardThemeProvider>
        </div>
      </div>
    );
  }
}

export { Card, PreviewCard, CardMarker };

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

import { ThemeProvider, btnStyle } from 'Src/styles/ThemeContext';

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
    return StyleSheet.create({
      uiColor,
      btn: {
        ...btnStyle,
        borderColor: uiColor,
        ':hover': {
          boxShadow: `4px 4px ${uiColor}`
        }
      },
      btnActive: {
        ...btnStyle,
        background: uiColor,
        color: 'whitesmoke'
        // borderColor: uiColor
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
      uiColor
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
          edit={edit}
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
        style={{ ...style, maxWidth: '500px', maxHeight: '800px' }}
      >
        <div
          className={`${cx.flipper} ${sideToggler}`}
          style={{
            background
          }}
        >
          <ThemeProvider value={{ stylesheet, uiColor }}>
            {togglecard()}
          </ThemeProvider>
        </div>
      </div>
    );
  }
}

export { Card, PreviewCard, CardMarker };

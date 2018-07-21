import React from 'react';
import PropTypes from 'prop-types';

import { CardMarker } from 'Cards';

import { GlobalThemeConsumer } from 'Src/styles/GlobalThemeContext';
import {css} from 'aphrodite'

const shadowStyle = {
  boxShadow: '3px 3px black',
  border: '1px solid #000'
  // border: '1px solid black'
};

const getShadowStyle = selected => (selected ? shadowStyle : {});

const PreviewMarker = ({
  selected,
  template,
  color,
  size = 25,
  offset = 100
}) => (
  <GlobalThemeConsumer>
    {({ stylesheet: { boxShadow } }) => (
      <CardMarker
        color={color}
        className={css(boxShadow)}
        style={{
          transform: selected && 'scale(1.5)',
          zIndex: selected && 5000,
          transition: 'transform 1s',
          position: 'absolute',
          // TODO
          boxShadow: selected && '3px 3px grey',
          width: size,
          height: size // '13vw',
        }}
      />
    )}
  </GlobalThemeConsumer>
);

PreviewMarker.defaultProps = {};

PreviewMarker.propTypes = {};

export default PreviewMarker;
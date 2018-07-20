import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createShadowStyle, UIthemeContext } from 'Cards/styles';

import idGenerate from 'Src/idGenerator';

class TextChallengeAuthor extends Component {
  static propTypes = {
    className: PropTypes.string,
    styles: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    reset: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    styles: {},
    onChange: d => d,
    uiColor: 'grey',
    description: null,
    title: null
  };

  state = { description: '', id: idGenerate(), ...this.props };

  componentDidUpdate(prevProps, prevState) {
    const { description, title, id } = this.state;
    const { onChange } = this.props;
    if (description !== prevState.description || title !== prevState.title) {
      onChange({
        id,
        type: 'text',
        description,
        title
      });
    }
  }

  render() {
    const {
      className,
      placeholder,
      styles,
      onChange,
      uiColor,
      description,
      title
    } = this.props;

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', ...styles }}
      >
        <div>
          <h4>Description</h4>
          <textarea
            onChange={e => this.setState({ description: e.target.value })}
            defaultValue={description}
            placeholder={placeholder}
            style={{ width: '100%', minHeight: 50, height: 50 }}
          />
        </div>
      </div>
    );
  }
}

export default TextChallengeAuthor;

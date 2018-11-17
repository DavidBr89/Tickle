import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {createShadowStyle, UIthemeContext} from 'Cards/styles';

import idGenerate from 'Src/idGenerator';

import uuidv1 from 'uuid/v1';

class TextChallengeAuthor extends Component {
  static propTypes = {
    className: PropTypes.string,
    styles: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    reset: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    styles: {},
    onChange: d => d,
    uiColor: 'grey',
    description: null,
    title: null,
  };

  state = {description: '', id: new uuidv1(), ...this.props};

  componentDidUpdate(prevProps, prevState) {
    const {description, title, id} = this.state;
    const {onChange} = this.props;
    if (description !== prevState.description || title !== prevState.title) {
      onChange({
        id,
        type: 'text',
        description,
        title,
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
      title,
    } = this.props;

    return (
      <div
        className={`${className} w-full h-full`}
        style={{width: '100%', height: '100%', ...styles}}>
        <section className="mb-2">
          <h2>Title</h2>
          <input
            className="form-control w-full"
            defaultValue={title}
            onChange={e => this.setState({title: e.target.value})}
          />
        </section>
        <section>
          <h2>Description</h2>
          <textarea
            className="form-control w-full"
            onChange={e => this.setState({description: e.target.value})}
            defaultValue={description}
            placeholder={placeholder}
            style={{minHeight: 200}}
          />
        </section>
      </div>
    );
  }
}

export default TextChallengeAuthor;

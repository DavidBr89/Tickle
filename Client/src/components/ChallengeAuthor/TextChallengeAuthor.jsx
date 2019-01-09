import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';

import uuidv1 from 'uuid/v1';

import Rating, {StarRating} from 'Components/utils/Rating';

const DifficultyRating = ({onChange, highlighted, ...props}) => (
  <Rating {...props} numHighlighted={highlighted} num={6}>
    {(on, i) => (
      <div
        onClick={() => {
          onChange(i);
        }}
        className={`m-1 ${on ? 'bg-black' : 'bg-grey'}`}
        style={{width: 30, height: 30}}
      />
    )}
  </Rating>
);

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

  state = {description: '', difficulty: 1, id: uuidv1(), ...this.props};

  componentDidUpdate(prevProps, prevState) {
    const {description, difficulty, title, id} = this.state;
    const {onChange} = this.props;
    if (description !== prevState.description || title !== prevState.title) {
      onChange({
        id,
        type: 'text',
        description,
        difficulty,
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
      description,
      title,
    } = this.props;

    const {difficulty} = this.state;

    return (
      <div
        className={`${className} flex flex-col flex-grow w-full h-full`}
        style={{...styles}}>
        <section className="mb-4">
          <h2 className="mb-1">Title</h2>
          <input
            className="form-control w-full"
            placeholder="Title"
            defaultValue={title}
            onChange={e => this.setState({title: e.target.value})}
          />
        </section>
        <section className="mb-4">
          <h2 className="mb-1">Description</h2>
          <textarea
            className="form-control w-full"
            placeholder="Description"
            onChange={e => this.setState({description: e.target.value})}
            defaultValue={description}
            style={{minHeight: 200}}
          />
        </section>
        <section>
          <h2>Difficulty</h2>
          <DifficultyRating
            highlighted={difficulty}
            onChange={df => this.setState({difficulty: df})}
            disabled={false}
          />
        </section>
      </div>
    );
  }
}

export default TextChallengeAuthor;

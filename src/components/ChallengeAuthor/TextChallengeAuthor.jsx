import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
        <section>
          <h2 className="mb-1">Description</h2>
          <textarea
            className="form-control w-full"
            placeholder="Description"
            onChange={e => this.setState({description: e.target.value})}
            defaultValue={description}
            placeholder="Description"
            style={{minHeight: 200}}
          />
        </section>
      </div>
    );
  }
}

export default TextChallengeAuthor;

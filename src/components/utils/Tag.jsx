import React, { Component } from 'react';
import PropTypes from 'prop-types';


const tagsStyle = { display: 'flex', marginBottom: 4 };
const tagStyle = {
  paddingLeft: 8,
  paddingRight: 8,
  textAlign: 'center',
  marginRight: 2,
  marginTop: 2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

export class TagList extends Component {
  static propTypes = {
    className: PropTypes.string,
    handleDelete: PropTypes.func,
    handleAddition: PropTypes.func,
    data: PropTypes.array,
    uiColor: PropTypes.string,
    colorScale: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    handleDelete: d => d,
    handleAddition: d => d,
    data: [],
    style: {}
  };

  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  // static getDerivedStateFromProps(nextProps) {
  //   console.log('nextProps', nextProps);
  //   return null; // { value: '' };
  // }

  render() {
    const {
      data,
      uiColor,
      colorScale,
      handleDelete,
      handleAddition,
      className,
      style
    } = this.props;
    const { value } = this.state;
    return (
      <div className={className} style={style}>
        <div className="mb-1" style={{ display: 'flex' }}>
          <input
            className="form-control"
            style={{ width: '80%' }}
            value={value}
            onChange={({ target }) => this.setState({ value: target.value })}
          />
          <button
            className="btn ml-2"
            style={{ background: uiColor }}
            onClick={(event) => {
              this.setState({ value: '' });
              handleAddition(value);
              event.preventDefault();
            }}
          >
            Add
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {data.map((d, i) => (
            <Tag
              title={d}
              edit
              onClick={() => handleDelete(i)}
              color={colorScale(d)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export class TagInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    tags: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.string), null]),
    uiColor: PropTypes.string,
    colorScale: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    values: [],
    tags: [],
    onChange: d => d,
    uiColor: '',
    className: '',
    style: {}
  };

  constructor(props) {
    super(props);

    const { tags } = props;
    // const tags =
    // iniTags !== null ? iniTags.map((text, i) => ({ id: i, text })) : [];

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
  }

  state = { tags: this.props.tags || [] };

  handleDelete(i) {
    const { tags } = this.state;
    const newTags = tags.filter((d, j) => i !== j);
    this.setState({ tags: newTags });
  }

  componentDidUpdate(prevProps, prevState) {
    const { tags } = this.state;
    if (tags.length !== prevState.tags.length) this.props.onChange(tags);
  }

  handleAddition(tag) {
    if (!tag) return;
    const { tags } = this.state;
    const newTags = [...new Set([...tags, tag])];
    this.setState({ tags: newTags });
  }

  render() {
    const { tags } = this.state;
    const {
      uiColor, colorScale, className, style
    } = this.props;

    return (
      <TagList
        {...this.props}
        data={tags}
        colorScale={colorScale}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
      />
    );
  }
}

const Tags = ({ data }) => (
  <div style={tagsStyle}>
    {data.map(t => (
      <div key={t} style={tagStyle}>
        <small>{t}</small>
      </div>
    ))}
  </div>
);

Tags.propTypes = { data: PropTypes.array };
Tags.defaultProps = { data: ['tag1', 'exampleTag'] };

// const SmallPreviewTags = ({ data }) => (
//   <div className={cx.tags}>
//     {data.map(t => (
//       <div key={t} className={`${cx.tag} ${colorClass(t)}`}>
//         <small>{t}</small>
//       </div>
//     ))}
//   </div>
// );
//
const Tag = ({
  title, onClick, edit, small
}) => {
  const children = (
    <span style={{ whiteSpace: 'no-wrap' }}>
      {title}
      {edit && <span className="ml-1">x</span>}
    </span>
  );
  if (small) {
    return (
      <small
        key={title}
        onClick={onClick}
      >
        {children}
      </small>
    );
  }
  return (
    <div
      key={title}
      className="tag-label tag-label cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Tag.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  edit: PropTypes.bool,
  small: PropTypes.bool
};

Tag.defaultProps = {
  title: '',
  onClick: d => d,
  edit: false,
  small: false
};

export const PreviewTags = ({
  data,
  style,
  placeholder,
  small,
  onClick
}) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      overflow: 'hidden',
      ...style
      // overflowY: 'visible'
      // flexWrap: 'no-wrap'
      // alignItems: 'center'
    }}
  >
    {data !== null
      && data.length > 0
      && data.map(t => <Tag title={t} small={small} />)}
  </div>
);

PreviewTags.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, null]),
  style: PropTypes.object,
  placeholder: PropTypes.string,
  small: PropTypes.bool,
  colorScale: PropTypes.func
};

PreviewTags.defaultProps = {
  data: null,
  style: {},
  placeholder: 'Please add a tag',
  small: false
};

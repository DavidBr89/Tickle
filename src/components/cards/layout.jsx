import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'mygrid/dist';
import { WithContext as ReactTags } from 'react-tag-input';
import { profileSrc, mediaScale, colorClass, colorScaleRandom } from './styles';
// TODO: remove
import { ModalBody } from '../utils/modal';
// import placeholderImg from './placeholder.png';

import cx from './Card.scss';

const SearchIcon = ({ style, className }) => (
  <i
    className={`fa fa-search ${className}`}
    style={{ cursor: 'pointer', opacity: 0.75, fontSize: '1rem', ...style }}
  />
);

SearchIcon.propTypes = { style: PropTypes.object, className: PropTypes.string };
SearchIcon.defaultProps = { style: {}, className: '' };

const EditIcon = ({ style, className }) => (
  <i
    className={`fa fa-pencil-square-o ${className}`}
    style={{ cursor: 'pointer', opacity: 0.75, fontSize: '1.2rem', ...style }}
  />
);

EditIcon.propTypes = { style: PropTypes.object, className: PropTypes.string };
EditIcon.defaultProps = { style: {}, className: '' };

const Legend = ({ children, style }) => (
  <legend
    style={{
      width: 'unset',
      marginRight: '2px',
      fontSize: '18px',
      marginBottom: 0,
      fontStyle: 'italic',
      ...style
    }}
  >
    {children}
  </legend>
);

Legend.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
};

Legend.defaultProps = { style: {}, children: null };

const FieldSet = ({ children, legend, style, edit, borderColor, onClick }) => (
  <div style={{ ...style, pointerEvents: 'all' }} onClick={onClick}>
    <fieldset
      style={{
        border: `1px solid ${borderColor}`,
        marginTop: '4px',
        padding: '6px',
        width: '100%',
        height: '100%'
      }}
    >
      <Legend>
        {legend}{' '}
        {!edit ? (
          <SearchIcon style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
        ) : (
          <EditIcon style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
        )}
      </Legend>
      {children}
    </fieldset>
  </div>
);

FieldSet.propTypes = {
  borderColor: PropTypes.string,
  legend: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  edit: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.oneOf([null, PropTypes.func])
};

FieldSet.defaultProps = {
  edit: false,
  borderColor: 'grey',
  classname: '',
  onClick: null,
  style: {}
};

const DescriptionField = ({
  text,
  onEdit,
  onClick,
  placeholder,
  style,
  borderColor,
  edit
}) => (
  <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
    <FieldSet
      style={{ height: '90%' }}
      edit={edit}
      borderColor={borderColor}
      legend={'Description'}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <div className={cx.textClamp} style={{ height: '100%' }}>
          {text !== null ? (
            text
          ) : (
            <span style={{ fontStyle: 'italic' }}>{placeholder}</span>
          )}
        </div>
      </div>
    </FieldSet>
  </div>
);

DescriptionField.propTypes = {
  text: PropTypes.oneOf([PropTypes.string, null]),
  // TODO: how to
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  borderColor: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

DescriptionField.defaultProps = {
  text: null,
  onEdit: null,
  onClick: null,
  borderColor: null,
  placeholder:
    'Add a description for your card to give hints how to succeed the Challenge',
  style: {},
  edit: false
};

const MediaField = ({
  media,
  onEdit,
  onClick,
  style,
  placeholder,
  borderColor,
  edit
}) => (
  <div
    style={{ ...style, cursor: 'pointer', overflow: 'hidden' }}
    onClick={onClick || onEdit}
  >
    <FieldSet edit={edit} legend={'Media'} borderColor={borderColor}>
      <div style={{ display: 'flex', alignContent: 'end' }}>
        {Array.isArray(media) ? (
          <PreviewMedia
            data={media.slice(0, 4)}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div style={{ fontStyle: 'italic' }}>{placeholder}</div>
        )}
      </div>
    </FieldSet>
  </div>
);

MediaField.propTypes = {
  media: PropTypes.oneOf([null, PropTypes.array]),
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  borderColor: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

MediaField.defaultProps = {
  media: null,
  onEdit: null,
  onClick: null,
  placeholder: 'Add a video, webpage or a sound snippet',
  style: {},
  borderColor: 'grey',
  edit: false
};

const PreviewMedia = ({ data, style }) => (
  <div style={style}>
    <Grid cols={data.length > 1 ? 2 : 0} rows={Math.min(data.length / 2, 1)}>
      {data.map(m => (
        <div key={m.url}>
          <div className="mr-1 row">
            <i
              style={{ fontSize: '20px' }}
              className={`fa ${mediaScale(m.type)} col-1`}
              aria-hidden="true"
            />
            <div className={`ml-1 col ${cx.textTrunc}`}>{m.title}</div>
          </div>
        </div>
      ))}
    </Grid>
  </div>
);

PreviewMedia.propTypes = {
  data: PropTypes.array.isRequired,
  style: PropTypes.object
  // extended: PropTypes.bool
};

PreviewMedia.defaultProps = {
  data: [{ title: 'bka', url: 'bla', descr: 'bla' }],
  extended: false,
  style: { width: '90%' }
};

const EditButton = ({ style, onClick, className }) => (
  <button className={`close ml-1 ${className}`} onClick={onClick}>
    <EditIcon style={{ ...style, fontSize: '2rem' }} />
  </button>
);

EditButton.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func
};

EditButton.defaultProps = { style: {}, onClick: () => null, className: '' };

const Img = ({ src, style }) => (
  <div
    className="mt-1 mb-1"
    style={{ border: '1px solid var(--black)', ...style }}
  >
    <img src={src} alt="Card img" style={{ width: '100%', height: '100%' }} />
  </div>
);

Img.propTypes = {
  src: PropTypes.string,
  style: {}
};

Img.defaultProps = { src: '', style: {} };

class MyTags extends Component {
  static propTypes = {
    className: PropTypes.string,
    handleDelete: PropTypes.func,
    handleAddition: PropTypes.func,
    data: PropTypes.array,
    uiColor: PropTypes.string
  };

  static defaultProps = {
    className: '',
    handleDelete: d => d,
    handleAddition: d => d,
    data: [],
    uiColor: 'black'
  };

  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  componentWillReceiveProps() {
    this.setState({ value: '' });
  }

  render() {
    const {
      data,
      uiColor,
      handleDelete,
      handleAddition,
      className
    } = this.props;
    const { value } = this.state;
    return (
      <div className={className}>
        <div className="mb-1" style={{ display: 'flex' }}>
          <input
            value={value}
            onChange={({ target }) => this.setState({ value: target.value })}
          />
          <button
            className="btn btn-active ml-2"
            style={{ background: uiColor }}
            onClick={() => handleAddition(value)}
          >
            Add
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {data.map((d, i) => (
            <Tag title={d} edit onClick={() => handleDelete(i)} />
          ))}
        </div>
      </div>
    );
  }
}

class TagInput extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    tags: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.string), null]),
    uiColor: PropTypes.string
  };

  static defaultProps = {
    values: [],
    tags: [],
    onSubmit: d => d,
    uiColor: ''
  };

  constructor(props) {
    super(props);

    const { tags } = props;
    // const tags =
    // iniTags !== null ? iniTags.map((text, i) => ({ id: i, text })) : [];

    this.state = { tags: tags || [] };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
  }

  handleDelete(i) {
    const tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({ tags });
  }

  handleAddition(tag) {
    const tags = this.state.tags;
    const newTags = [...new Set([...tags, tag])];
    console.log('tags', tags, 'newTags', newTags, tag);
    this.setState({ tags: newTags });
  }

  render() {
    const { tags } = this.state;
    const { onSubmit, uiColor } = this.props;

    return (
      <ModalBody onSubmit={() => onSubmit(tags)} uiColor={uiColor}>
        <MyTags
          uiColor={uiColor}
          data={tags}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
        />
      </ModalBody>
    );
  }
}

const Tags = ({ data }) => (
  <div className={cx.tags}>
    {data.map(t => (
      <div key={t} className={`${cx.tag} ${colorClass(t)}`}>
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
const Tag = ({ title, onClick, edit, small }) => {
  const children = (
    <span style={{ whiteSpace: 'no-wrap' }}>
      {title}
      {edit && <span style={{ marginLeft: '2px' }}>x</span>}
    </span>
  );
  if (small)
    return (
      <small
        key={title}
        className={`${cx.tag} ${colorClass(title)}`}
        onClick={onClick}
      >
        {/* TODO: put small out */}
        {children}
      </small>
    );
  return (
    <div
      key={title}
      className={`${cx.tag} ${colorClass(title)}`}
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

Tag.defaultProps = { title: '', onClick: d => d, edit: false, small: false };

const PreviewTags = ({ data, style, placeholder, small }) => (
  <div
    style={{
      display: 'flex',
      // position: 'absolute',
      ...style
      // overflowY: 'visible'
      // flexWrap: 'no-wrap'
      // alignItems: 'center'
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data !== null ? (
      data.map(t => <Tag title={t} small={small} />)
    ) : (
      <div style={{ fontStyle: 'italic' }}>{placeholder}</div>
    )}
  </div>
);

PreviewTags.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, null]),
  style: PropTypes.object,
  placeholder: PropTypes.string,
  small: PropTypes.bool
};

PreviewTags.defaultProps = {
  data: null,
  style: {},
  placeholder: 'Please add a tag',
  small: false
};

const ChallengeButton = ({
  collected,
  onClick,
  expPoints,
  color,
  style,
  edit
}) => (
  <button
    className={`btn btn-active btn-lg btn-block}`}
    disabled={collected}
    style={{
      width: '100%',
      alignSelf: 'flex-end',
      background: color,
      fontWeight: 'bold',
      ...style
    }}
    onClick={onClick}
  >
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span style={{ display: 'inline-flex' }}>
        {edit ? 'Add Challenge' : 'Collect'}
        {edit && (
          <EditIcon
            className="ml-1"
            style={{ color: 'white', fontSize: '2rem' }}
          />
        )}
      </span>
      {!edit && (
        <div
          style={{
            marginLeft: '4px',
            paddingLeft: '4px',
            paddingRight: '4px',
            border: '2px grey solid'
            // borderRadius: '5px'
          }}
        >
          {`${expPoints}xp`}
        </div>
      )}
    </div>
  </button>
);

ChallengeButton.propTypes = {
  collected: PropTypes.bool,
  edit: PropTypes.bool,
  onClick: PropTypes.func,
  expPoints: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

ChallengeButton.defaultProps = {
  collected: false,
  toggleCardChallenge: d => d,
  expPoints: 60,
  color: 'black',
  onClick: d => d,
  edit: false,
  style: {}
};

const FlipButton = ({ style, onClick, color, className }) => (
  <button
    className={`btn ${className}`}
    style={{
      background: color,
      color: 'whitesmoke',
      width: '20%',
      ...style
    }}
    onClick={onClick}
  >
    <i className="fa fa-retweet fa-2x" aria-hidden="true" />
  </button>
);

FlipButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string
};
FlipButton.defaultProps = {
  style: {},
  onClick: d => d,
  color: 'black',
  className: ''
};

const Comments = ({ data, extended }) => (
  <div
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    {data.map(({ comment, user, date, imgSrc }) => (
      <div>
        <img
          className={`${cx.avatar}`}
          width={'100%'}
          height={'100%'}
          src={imgSrc}
          alt="alt"
        />
        {extended && (
          <div className="media-body">
            <div className={cx.textClamp}>
              <small>{comment}</small>
            </div>
            <div>
              <small className="font-italic">
                - {user}, {date}
              </small>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

Comments.propTypes = {
  data: PropTypes.array.isRequired,
  extended: PropTypes.bool.isRequired
};

Comments.defaultProps = {
  data: [
    {
      user: 'Jan',
      date: new Date(),
      comment: 'Yes, cool shit',
      imgSrc: profileSrc()
    }
  ],
  extended: false
};

export {
  FieldSet,
  DescriptionField,
  PreviewMedia,
  MediaField,
  EditButton,
  FlipButton,
  Img,
  Tags,
  TagInput,
  PreviewTags,
  ChallengeButton,
  Comments
};

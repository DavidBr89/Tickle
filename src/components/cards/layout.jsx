import React from 'react';
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

const FieldSet = ({ children, legend, style, edit, color, onClick }) => (
  <div style={style} onClick={onClick}>
    <fieldset
      style={{
        border: `1px solid ${color}`,
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
  color: PropTypes.string,
  legend: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  edit: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.oneOf([null, PropTypes.func])
};

FieldSet.defaultProps = {
  edit: false,
  color: 'grey',
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
  color,
  edit
}) => (
  <div
    style={{ height: '20%', ...style, cursor: 'pointer' }}
    onClick={onClick || onEdit}
  >
    <FieldSet
      style={{ height: '90%' }}
      edit={edit}
      color={color}
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
  color: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

DescriptionField.defaultProps = {
  text: null,
  onEdit: null,
  onClick: null,
  color: null,
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
  color,
  edit
}) => (
  <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
    <FieldSet edit={edit} legend={'Media'} color={color}>
      <div style={{ display: 'flex', alignContent: 'end' }}>
        {Array.isArray(media) ? (
          <PreviewMedia
            data={media}
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
  color: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

MediaField.defaultProps = {
  media: null,
  onEdit: null,
  onClick: null,
  placeholder: 'Add a video, webpage or a sound snippet',
  style: {},
  color: 'grey',
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
  <button className={`close ${className}`} onClick={onClick}>
    <i
      className={`fa  fa-pencil-square-o ml-1 `}
      style={{ cursor: 'pointer', fontSize: '2rem', ...style }}
    />
  </button>
);

EditButton.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func
};

EditButton.defaultProps = { style: {}, onClick: () => null, className: '' };

const Img = ({ src }) => (
  <div className="mt-1 mb-1">
    <img src={src} alt="Card img" style={{ width: '100%', height: '100%' }} />
  </div>
);

Img.propTypes = {
  src: PropTypes.string
};

Img.defaultProps = { src: '' };

class TagInput extends React.Component {
  static propTypes = {
    values: PropTypes.array,
    onSubmit: PropTypes.func,
    tags: PropTypes.oneOf([ PropTypes.arrayOf(PropTypes.string), null ])
  };

  static defaultProps = {
    values: [],
    tags: [],
    onSubmit: d => d
  }

  constructor(props) {
    super(props);

    const { tags: iniTags } = props;

    const tags =
      iniTags !== null ? iniTags.map((text, i) => ({ id: i, text })) : [];

    this.state = {
      tags,
      suggestions: ['Belgium', 'Germany', 'Brazil']
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i) {
    const tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({ tags });
  }

  handleAddition(tag) {
    const tags = this.state.tags;
    tags.push({
      id: tags.length + 1,
      text: tag
    });
    this.setState({ tags });
  }

  handleDrag(tag, currPos, newPos) {
    const tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags });
  }

  render() {
    const { tags, suggestions } = this.state;
    const { onSubmit } = this.props;

    return (
      <ModalBody onSubmit={() => onSubmit(tags.map(d => d.text))}>
        <ReactTags
          classNames={{
            tags: 'tagsClass',
            tagInput: 'tagInputClass',
            tagInputField: 'tagInputFieldClass',
            selected: 'selectedClass',
            tag: `${cx.tag} ${colorScaleRandom()}`,
            remove: 'removeClass',
            suggestions: 'suggestionsClass',
            activeSuggestion: 'activeSuggestionClass'
          }}
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
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

const PreviewTags = ({ data, style, placeholder }) => (
  <div
    style={{
      display: 'flex',
      ...style
      // flexWrap: 'no-wrap'
      // alignItems: 'center'
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data !== null ? (
      data.map(t => (
        <span key={t} className={`${cx.tag} ${colorClass(t)}`}>
          {t}
        </span>
      ))
    ) : (
      <div style={{ fontStyle: 'italic' }}>{placeholder}</div>
    )}
  </div>
);

PreviewTags.propTypes = {
  data: PropTypes.oneOf([PropTypes.array, null]),
  style: PropTypes.object
};

PreviewTags.defaultProps = {
  data: null,
  style: {},
  placeholder: 'Please add a tag'
};

const CollectButton = ({ collected, onClick, expPoints, color, style }) => (
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
      <span>{'Collect'}</span>
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
    </div>
  </button>
);

CollectButton.propTypes = {
  collected: PropTypes.bool,
  onClick: PropTypes.func,
  expPoints: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

CollectButton.defaultProps = {
  collected: false,
  toggleCardChallenge: d => d,
  expPoints: 60,
  color: 'black',
  onClick: d => d,
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
  CollectButton,
  Comments
};

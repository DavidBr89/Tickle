import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'mygrid/dist';
import { scaleOrdinal, scaleLinear, range } from 'd3';
import { WithContext as ReactTags } from 'react-tag-input';
import { Modal, ModalBody } from '../utils/modal';

import cx from './Card.scss';

import colorClasses from '../utils/colorClasses';
import { mediaTypes } from '../../dummyData';

const mediaScale = scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

const colorScaleRandom = scaleLinear()
  .domain(range(colorClasses.length))
  .range(colorClasses)
  .clamp(true);

const colorClass = (title = 'title') =>
  colorScaleRandom(title.length % colorClasses.length);

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
  <legend style={{ width: 'unset', marginRight: '2px', ...style }}>
    {children}
  </legend>
);

Legend.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
};

Legend.defaultProps = { style: {}, children: null };

const FieldSet = ({ children, legend, style, edit, color }) => (
  <fieldset
    className={cx.field}
    style={{ ...style, border: `1px solid ${color}` }}
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
);

FieldSet.proptypes = {
  classname: PropTypes.string,
  color: PropTypes.string,
  legend: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  edit: PropTypes.bool,
  style: PropTypes.object
};

FieldSet.defaultProps = {
  edit: false,
  color: 'grey',
  classname: '',
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
      style={{ height: '90%', border: `1px solid ${color}` }}
      edit={edit}
      color={color}
      legend={' Description '}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <div className={cx.textClamp} style={{ height: '100%' }}>
          {!edit ? text : placeholder}
        </div>
      </div>
    </FieldSet>
  </div>
);

DescriptionField.propTypes = {
  text: PropTypes.string.isRequired,
  // TODO: how to
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

DescriptionField.defaultProps = {
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
    <FieldSet
      style={{ border: `1px solid ${color}` }}
      edit={edit}
      legend={'Media'}
      color={color}
    >
      <div style={{ display: 'flex', alignContent: 'end' }}>
        {media.length !== 0 ? (
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
  media: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

MediaField.defaultProps = {
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
    onSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);

    const { tags } = props;
    this.state = {
      tags: tags.map((text, i) => ({ id: i, text })),
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

export {
  FieldSet,
  DescriptionField,
  PreviewMedia,
  MediaField,
  EditButton,
  Img,
  colorScaleRandom,
  colorClass
};

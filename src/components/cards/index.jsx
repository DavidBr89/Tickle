import 'w3-css';

import React, { Component, PureComponent } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import MapGL from 'react-map-gl';
import { WithContext as ReactTags } from 'react-tag-input';
import Grid from 'mygrid/dist';
import * as chromatic from 'd3-scale-chromatic';
// import ClampLines from 'react-clamp-lines';
// import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { CardMarker } from '../utils/map-layers/DivOverlay';
import { challengeTypes, mediaTypes, skillTypes } from '../../dummyData';
import cx from './Card.scss';
import colorClasses from '../colorClasses';
// TODO: rename
import { Wrapper } from '../utils';
import placeholderImg from './placeholder.png';
import { SmallModal, ModalBody, MediaSearch } from './utils';

const random = () => Math.random() * 1000;

const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};
// console.log('colorClasses', colorClasses);

const mediaScale = d3
  .scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

// console.log('mediaScale', mediaScale('hyperlink'));
const colorScale = d3
  .scaleOrdinal()
  .domain(challengeTypes)
  .range(chromatic.schemePastel1);

const colorScaleRandom = d3
  .scaleLinear()
  .domain(d3.range(colorClasses.length))
  .range(colorClasses)
  .clamp(true);

const skillColorScale = d3
  .scaleOrdinal()
  .domain(skillTypes)
  .range(colorClasses);

const colorClass = (title = 'title') =>
  colorScaleRandom(title.length % colorClasses.length);

const defaultProps = {
  title: 'Enter a Title',
  challenge: { type: 'gap text' },
  // date: '28/04/2012 10:00',
  tags: [],
  img: placeholderImg,
  xpPoints: 0,
  // TODO: remove in future to component
  description: '',
  loc: { latitude: 50.828797, longitude: 4.352191 },
  creator: 'Jan',
  radius: 200,
  media: [],
  comments: []
};

const EditButton = ({ style, onClick }) => (
  <i
    className="fa fa-2x fa-pencil-square-o ml-1"
    style={{ cursor: 'pointer', ...style }}
    onClick={onClick}
  />
);

EditButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func
};

EditButton.defaultProps = { style: {}, onClick: () => null };

const CardImg = ({ src }) => (
  <div className="mt-1 mb-1">
    <img src={src} alt="Card img" style={{ width: '100%', height: '100%' }} />
  </div>
);

const Description = ({ text, onEdit, placeholder }) => (
  <div style={{ height: '20%' }}>
    <fieldset className={`${cx.field}`} style={{ height: '90%' }}>
      <legend>description</legend>
      <div style={{ display: 'flex', alignContent: 'end', height: '100%' }}>
        <div className={cx.textClamp} style={{ height: '100%' }}>
          {text !== '' && onEdit ? text : placeholder}
        </div>
        {onEdit && (
          <div>
            <EditButton onClick={onEdit} />
          </div>
        )}
      </div>
    </fieldset>
  </div>
);

Description.propTypes = {
  text: PropTypes.string.isRequired,
  // TODO: how to
  onEdit: PropTypes.func,
  placeholder: PropTypes.string
};

Description.defaultProps = {
  onEdit: null,
  placeholder: 'Add a description'
};

const PreviewMedia = ({ data }) => (
  <Grid cols={data.length} rows={1}>
    {data.map(m => (
      <div key={m.src + random()}>
        <div className="mr-1 row">
          <i
            className={`fa ${mediaScale(m.type)} fa-2x col-1`}
            aria-hidden="true"
          />
          <div className="ml-1 col">
            <a href={m.src}>name</a>
          </div>
        </div>
      </div>
    ))}
  </Grid>
);

PreviewMedia.propTypes = {
  data: PropTypes.array.isRequired
  // extended: PropTypes.bool
};

PreviewMedia.defaultProps = { data: defaultProps.media, extended: false };

const ReadCardFront = ({
  title,
  tags,
  img,
  description,
  media,
  onCollect,
  flipHandler,
  onClose,
  style
}) => (
  <CardHeader
    title={title}
    onClose={onClose}
    flipHandler={flipHandler}
    style={style}
  >
    <div
      className={cx.cardDetail}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '90%'
      }}
    >
      <PreviewTags data={tags} />

      <CardImg src={img} />
      <Description text={description} />
      <div>
        <fieldset className={cx.field}>
          <legend>Media:</legend>
          <PreviewMedia data={media} />
        </fieldset>
      </div>
      <CollectButton onClick={onCollect} />
    </div>
  </CardHeader>
);

ReadCardFront.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  onCollect: PropTypes.func,
  children: PropTypes.array,
  onClose: PropTypes.func,
  flipHandler: PropTypes.func,
  style: PropTypes.object
};

ReadCardFront.defaultProps = { ...defaultProps, onCollect: null };

class EditCardFront extends PureComponent {
  static propTypes = {
    ...ReadCardFront.propTypes,
    onUpdate: PropTypes.func
  };
  static defaultProps = {
    ...ReadCardFront.defaultProps,
    onUpdate: () => null
  };

  constructor(props) {
    super(props);
    this.state = { data: { ...props }, dialog: null };
    this.nodeDescription = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const prevData = prevState.data;
    const { data } = this.state;
    // TODO: check the other attrs
    if (
      prevData.description !== data.description ||
      prevData.title !== data.title
    )
      this.props.onAttrUpdate({ ...data });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // return this.props.description !== nextProps.description;
  //   return false;
  // }

  setFieldState(field) {
    this.setState(oldState => ({
      data: { ...oldState.data, ...field }
    }));
  }

  modalContent(modalTitle) {
    const { data } = this.state;
    // TODO: img
    const { title, tags, img, description, media, challenge } = data;
    switch (modalTitle) {
      case 'Title':
        return (
          <ModalBody
            onSubmit={() => this.setFieldState({ title: this.nodeTitle.value })}
          >
            <div className="form-group">
              <input
                ref={n => (this.nodeTitle = n)}
                style={{ width: '100%' }}
                defaultValue={title}
              />
            </div>
          </ModalBody>
        );
      case 'Tags':
        return (
          <TagInput
            tags={tags}
            onSubmit={newTags => this.setFieldState({ tags: newTags })}
          />
        );
      case 'Photo':
        return <div>photo</div>;
      case 'Description':
        return (
          <ModalBody
            onSubmit={() =>
              this.setFieldState({ description: this.nodeDescription.value })
            }
          >
            <div className="form-group">
              <textarea
                ref={n => (this.nodeDescription = n)}
                style={{ width: '100%' }}
                onSubmit={() => null}
                placeholder={'<Please insert your description>'}
              >
                {description}
              </textarea>
            </div>
          </ModalBody>
        );
      case 'Media':
        return (
          <div>
            <MediaSearch media={media} onSubmit={() => null} />
          </div>
        );
      case 'Challenge':
        return <div>challenge</div>;
      default:
        return <div>error</div>;
    }
  }

  render() {
    const { onClose, flipHandler, style } = this.props;
    const { data } = this.state;
    const { title, tags, img, description, media, children, challenge } = data;
    const { dialog } = this.state;
    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.title : null;
    // const modalStyle = modalVisible
    //   ? { background: 'black', opacity: 0.5 }
    //   : {};
    return (
      <CardHeader
        edit
        title={title}
        onClose={onClose}
        onEdit={() =>
          this.setState({
            dialog: { title: 'Title', data: title }
          })
        }
        flipHandler={flipHandler}
        style={style}
      >
        <div style={{ height: '100%' }}>
          <SmallModal
            visible={modalVisible}
            title={modalVisible ? dialog.title : ''}
            onClose={() => this.setState({ dialog: null })}
          >
            {this.modalContent(dialogTitle)}
          </SmallModal>
          <div
            className={cx.cardDetail}
            style={{
              display: 'flex',
              flexDirection: 'column',
              // justifyContent: 'space-between',
              height: '90%'
            }}
          >
            <div style={{ display: 'flex' }}>
              {tags.length !== 0 ? (
                <PreviewTags data={tags} />
              ) : (
                <div>{'Add a tag'}</div>
              )}
              <EditButton
                style={{ fontSize: '24px' }}
                onclick={() =>
                  this.setstate({
                    dialog: { title: 'Tags', data: tags }
                  })
                }
              />
            </div>
            <CardImg src={img} />
            <Description
              text={description}
              onEdit={() =>
                this.setState({
                  dialog: {
                    title: 'Description',
                    id: 'description',
                    data: description
                  }
                })
              }
            />

            <div style={{ height: '15%' }}>
              <fieldset className={cx.field}>
                <legend>Media:</legend>
                <div style={{ display: 'flex', alignContent: 'end' }}>
                  {media.length !== 0 ? (
                    <PreviewMedia data={tags} />
                  ) : (
                    <div>{'Add a video, webpage or a sound snippet'}</div>
                  )}
                  <div>
                    <EditButton
                      onClick={() =>
                        this.setState({
                          dialog: { title: 'Media', data: media }
                        })
                      }
                    />
                  </div>
                </div>
              </fieldset>
            </div>
            <div>
              <div style={{ display: 'flex', alignContent: 'end' }}>
                <div className="p-1 pt-3" style={{ width: '100%' }}>
                  <button
                    className={`btn btn-secondary btn-lg btn-block}`}
                    style={{ width: '100%', alignSelf: 'flex-end' }}
                    onClick={() =>
                      this.setState({
                        dialog: {
                          title: 'Challenge',
                          data: challenge
                        }
                      })
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center'
                      }}
                    >
                      <div>{'Challenge'}</div>
                      <div
                        style={{
                          marginLeft: '4px',
                          paddingLeft: '4px',
                          paddingRight: '4px'
                        }}
                      >
                        <EditButton />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </CardHeader>
    );
  }
}

EditCardFront.defaultProps = defaultProps;

const CardFront = props =>
  props.edit ? <EditCardFront {...props} /> : <ReadCardFront {...props} />;

CardFront.propTypes = {
  ...ReadCardFront.propTypes,
  edit: PropTypes.bool,
  onAttrUpdate: PropTypes.func
};

CardFront.defaultProps = {
  ...defaultProps,
  edit: false,
  onAttrUpdate: () => null
};

const Tags = ({ data }) => (
  <div className={cx.tags}>
    {data.map(t => (
      <div key={t + random()} className={`${cx.tag} ${colorClass(t)}`}>
        <small>{t}</small>
      </div>
    ))}
  </div>
);

Tags.propTypes = { data: PropTypes.array };
Tags.defaultProps = { data: ['tag1', 'exampleTag'] };

const PreviewTags = ({ data, style }) => (
  <div
    style={{
      display: 'flex',
      ...style
      // flexWrap: 'no-wrap'
      // alignItems: 'center'
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data.map(t => (
      <span key={t + random()} className={`${cx.tag} ${colorClass(t)}`}>
        {t}
      </span>
    ))}
  </div>
);

PreviewTags.propTypes = {
  data: PropTypes.array,
  style: PropTypes.object
};

PreviewTags.defaultProps = {
  data: ['tag', 'tag1', 'tag2'],
  style: {}
};

const SmallPreviewTags = ({ data, style }) => (
  <div
    style={{
      display: 'flex',
      ...style
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data.map(t => (
      <small key={t + random()} className={`${cx.tag} ${colorClass(t)}`}>
        {t}
      </small>
    ))}
  </div>
);

SmallPreviewTags.propTypes = {
  data: PropTypes.array,
  style: PropTypes.object
};

SmallPreviewTags.defaultProps = {
  data: ['tag', 'tag1', 'tag2'],
  style: {}
};

const EmptySmallTags = ({ data, style }) => (
  <div
    style={{
      display: 'flex',
      ...style
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data.map(t => (
      <small
        key={t + random()}
        style={{ background: 'grey' }}
        className={`${cx.tag}`}
      >
        <span style={{ opacity: 0 }}>{t}</span>
      </small>
    ))}
  </div>
);

EmptySmallTags.propTypes = {
  data: PropTypes.array,
  style: PropTypes.object
};

EmptySmallTags.defaultProps = {
  data: ['tag', 'tag1', 'tag2'],
  style: {}
};

// const SmallCategories = ({ data }) => (
//   <div className={`${cx.textTrunc} ${cx.tags}`}>
//     {data.map(t => (
//       <small key={t + random()} className={`${cx.tag} ${colorClass(t)}`}>
//         {t}
//       </small>
//     ))}
//   </div>
// );

// const PlaceholderCard = ({ onClick }) => (
//   <div
//     style={{
//       width: '100%',
//       height: '100%',
//       display: 'flex',
//       alignContent: 'center',
//       alignItems: 'center',
//       background: 'lightgrey',
//       border: '1px dashed grey'
//       // margin: '10%'
//     }}
//     onClick={onClick}
//   >
//     <i
//       className="fa fa-4x fa-plus"
//       aria-hidden="true"
//       style={{
//         textAlign: 'center',
//         width: '100%',
//         color: 'grey',
//         pointerEvents: 'cursor'
//       }}
//     />
//   </div>
// );
//
//
const PlaceholderAttr = ({ text, style }) => (
  <div
    style={{
      display: 'flex',
      border: 'grey 1px dashed',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <h4
      style={{
        // width: '10%',
        marginTop: '4px',
        marginBottom: '4px',
        color: 'grey',
        paddingLeft: '2px',
        ...style
      }}
    >
      {text}
    </h4>
    <i
      className="fa fa-1x fa-plus"
      aria-hidden="true"
      style={{
        textalign: 'center',
        // width: '10%',
        marginLeft: '2px',
        color: 'grey',
        pointerevents: 'cursor'
      }}
    />
  </div>
);
PlaceholderAttr.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object
};
PlaceholderAttr.defaultProps = {
  style: {}
};

const PlaceholderCard = ({ title, tags, img, challengeType, onClick }) => (
  <div
    style={{
      padding: '5px',
      boxShadow: '9px 9px grey',
      backfaceVisibility: 'hidden',
      height: '100%',
      background: challengeType ? colorScale(challengeType) : 'lightgrey'
    }}
    onClick={onClick}
  >
    <div className={cx.cardHeader}>
      {title ? (
        <div
          style={{
            width: '100%',
            height: '24px',
            background: 'grey',
            // border: 'black 1px solid',
            marginTop: '4px',
            marginBottom: '4px'
          }}
        />
      ) : (
        <div style={{ height: '10%', width: '100%', marginBottom: '4px' }}>
          <PlaceholderAttr
            text={'Title'}
            style={{ height: '20px', fontSize: '18px' }}
          />
        </div>
      )}
    </div>
    {tags ? (
      <EmptySmallTags
        style={{ height: '18px' }}
        data={['sasa', 'osaas', 'sa']}
      />
    ) : (
      <div style={{ height: '18%' }}>
        <PlaceholderAttr
          text={'Tags'}
          style={{ height: '14px', fontSize: '14px' }}
        />
      </div>
    )}
    <div className="mt-1 mb-1" style={{ height: '50%' }}>
      {img ? (
        <img
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
          src={img}
          alt="Card cap"
        />
      ) : (
        <PlaceholderAttr
          text={'IMG'}
          style={{ height: '20px', fontSize: '18px' }}
        />
      )}
    </div>
  </div>
);

PlaceholderCard.propTypes = {
  title: PropTypes.bool,
  tags: PropTypes.bool,
  img: PropTypes.bool,
  challengeType: PropTypes.string,
  onClick: PropTypes.func
};

PlaceholderCard.defaultProps = {
  title: false,
  tags: false,
  img: false,
  challengeType: null
};

class PreviewCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    img: PropTypes.string,
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    selected: PropTypes.bool
  };

  static defaultProps = {
    title: '<Empty Title>',
    tags: ['tag1', 'tag2', 'tag3'],
    img: placeholderImg,
    style: {},
    selected: false,
    // TODO: include only type
    challenge: { type: 'hangman' }
  };

  shouldComponentUpdate(nextProps) {
    return this.props.selected !== nextProps.selected;
  }

  render() {
    const { title, tags, img, challenge, style, onClick } = this.props;
    return (
      <div
        style={{
          ...style,
          padding: '5px',
          backfaceVisibility: 'hidden',
          height: '100%',
          background: colorScale(challenge.type),
          boxShadow: '9px 9px grey'
        }}
        onClick={onClick}
      >
        <div className={cx.cardHeader}>
          <div
            className="text-truncate"
            style={{ fontSize: '16px', margin: '4px 0' }}
          >
            {title}
          </div>
        </div>
        <SmallPreviewTags data={tags} />
        <div className="mt-1 mb-1" style={{ height: '50%' }}>
          <img
            style={{
              display: 'block',
              width: '100%',
              height: '100%'
            }}
            src={img}
            alt="Card cap"
          />
        </div>
      </div>
    );
  }
}

const CardHeader = ({
  title,
  // img,
  onClose,
  challenge,
  children,
  flipHandler,
  edit,
  onEdit,
  style
  // id
}) => (
  <div
    className={`${cx.cardMini2} `}
    style={{
      background: colorScale(challenge.type),
      overflow: 'hidden',
      height: '100%',
      boxShadow: '9px 9px grey',
      ...style
    }}
  >
    <div className={cx.cardHeader} style={{ display: 'flex' }}>
      {/* TODO: find Solution */}
      <div style={{ display: 'inline-flex' }}>
        <h3 className="text-truncate" style={{ margin: '0' }}>
          {title}
        </h3>
        {edit && <EditButton onClick={onEdit} />}
      </div>
      <div className="btn-group">
        <button className="close mr-2" onClick={onClose}>
          <i className="fa fa-window-close fa-lg" aria-hidden="true" />
        </button>
        <button className="close" onClick={flipHandler}>
          <i className="fa fa-retweet fa-lg" aria-hidden="true" />
        </button>
      </div>
    </div>
    {children}
  </div>
);

CardHeader.propTypes = {
  title: PropTypes.string,
  // tags: PropTypes.array,
  // img: PropTypes.string,
  flipHandler: PropTypes.func,
  challenge: PropTypes.object,
  children: PropTypes.node,
  style: PropTypes.object,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  onEdit: PropTypes.func
};

CardHeader.defaultProps = {
  ...defaultProps,
  edit: false,
  onClose: () => null,
  onEdit: () => null
};

const Comments = ({ data, extended }) => (
  <div
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    {data.map(({ comment, user, date }) => (
      <div>
        <img
          className={`${cx.avatar}`}
          width={'100%'}
          height={'100%'}
          src={profileSrc()}
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
  data: [{ user: 'Jan', date: new Date(), comment: 'Yes, cool shit' }],
  extended: false
};

const SkillBar = ({ data }) => {
  const scale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.level))
    .range([30, 100]);

  // console.log('scale', scale.domain());

  return (
    <div style={{ display: 'flex' }}>
      {data.map(d => (
        <div
          className={`${skillColorScale(d.type)} ${cx.textTrunc}`}
          style={{
            width: `${scale(d.level)}%`,
            height: '30px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span>{d.type}</span>
        </div>
      ))}
    </div>
  );
};

SkillBar.propTypes = { data: PropTypes.array };

SkillBar.defaultProps = { data: [] };

const CardStack = ({ number }) => (
  // const scale = d3
  //   .scaleLinear()
  //   .domain([0])
  //   .range([30, 100]);

  <div style={{ display: 'flex' }}>
    {d3.range(0, number).map(() => (
      <div style={{ width: `${2}%` }}>
        <CardMarker width={30} />
      </div>
    ))}
  </div>
);

CardStack.propTypes = {
  number: PropTypes.number
};

CardStack.defaultProps = { number: 0 };

const Author = ({ extended, onClose, ...profile }) => {
  const { name, skills, activity, interests } = profile;
  if (!extended) {
    return (
      <fieldset className={cx.field}>
        <legend>Author:</legend>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <img
            className={`${cx.avatar}`}
            width={'80%'}
            height={'80%'}
            src={profileSrc()}
            alt="alt"
          />
        </div>
      </fieldset>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'column'
      }}
      className="mt-3"
    >
      <button
        type="button"
        className="close "
        style={{ position: 'absolute', top: 0 }}
        data-dismiss="modal"
        aria-label="Close"
        onClick={onClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <img
        className={`${cx.avatar}`}
        style={{ alignSelf: 'center' }}
        width={'40%'}
        height={'40%'}
        src={profileSrc()}
        alt="alt"
      />

      <div className="mt-2" style={{ fontSize: '14px', fontWeight: 700 }}>
        Personal
      </div>
      <fieldset className={cx.field}>
        <legend>Interests:</legend>
        <SkillBar data={interests} />
      </fieldset>

      <fieldset className={cx.field}>
        <legend>skills:</legend>
        <SkillBar data={skills} />
      </fieldset>
      <div className="mt-2" style={{ fontSize: '14px', fontWeight: 700 }}>
        Activity
      </div>
      <fieldset className={cx.field}>
        <legend>Collected Cards:</legend>
        <CardStack number={30} />
      </fieldset>
      <fieldset className={cx.field}>
        <legend>Created Cards:</legend>
        <CardStack number={14} />
      </fieldset>
    </div>
  );
};

// Author.propTypes = {
//   //  profile: PropTypes.shape({
//   name: PropTypes.string,
//   skills: PropTypes.array(
//     PropTypes.shape({ name: PropTypes.string, level: PropTypes.number })
//   ),
//   activity: PropTypes.object(
//     PropTypes.shape({
//       collectedCards: PropTypes.number,
//       createdCards: PropTypes.number
//     })
//   ),
//   extended: PropTypes.bool
// };

Author.defaultProps = {
  // profile: {
  name: 'jan',
  skills: [
    { type: 'arts', level: 22 },
    { type: 'music', level: 14 },
    { type: 'sports', level: 10 }
  ],
  interests: [
    { type: 'movies', level: 12 },
    { type: 'football', level: 5 },
    { type: 'xbox', level: 10 }
  ],
  activity: { collectedCards: 20, createdCards: 13 },
  // },
  extended: false
};

const Profile = ({ data }) => (
  <div className="media mt-3">
    <img
      className={`d-flex mr-3 ${cx.avatar}`}
      width={64}
      height={64}
      src={profileSrc()}
      alt="alt"
    />
    <div className="media-body">
      <div className={cx.textClamp}>{data.comment}</div>
      <div>
        <small className="font-italic">- {data.name}</small>
      </div>
    </div>
  </div>
);

Profile.propTypes = {
  data: PropTypes.object.isRequired
};
Profile.defaultProps = {
  data: {}
};

// TODO; rempve
Profile.defaultProps = { name: 'jan', comment: 'yeah' };

class ReadCardBack extends Component {
  static propTypes = {
    key: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    challenge: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    flipHandler: PropTypes.func.isRequired,
    linkedCards: PropTypes.array,
    loc: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    media: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { extended: null };
  }

  render() {
    const {
      challenge,
      comments,
      media,
      cardSets,
      linkedCards,
      loc,
      author
    } = this.props;
    const { extended } = this.state;
    const selectField = field => () =>
      this.setState(prevstate => ({
        extended: prevstate.extended !== field ? field : null
      }));

    const setSizeProps = field => {
      if (field === extended)
        return {
          colSpan: 2,
          rowSpan: 3
        };
      return {};
    };
    const isHidden = field => extended !== null && extended !== field;
    const display = field => ({
      display: isHidden(field) ? 'none' : null
    });

    return (
      <div
        className={`container ${cx.cardMini2} `}
        style={{
          height: '90%',
          zIndex: -10
        }}
      >
        <Grid cols={2} rows={3} gap={1}>
          <div
            {...setSizeProps('author')}
            style={display('author')}
            onClick={selectField('author')}
          >
            <Author
              {...author}
              extended={extended === 'author'}
              onClose={() => {
                // TODO
                // console.log('onCLose');
                // this.setState({ extended: null });
              }}
            />
          </div>
          <div onClick={selectField('map')}>
            <fieldset
              className={cx.field}
              style={display('map')}
              {...setSizeProps('map')}
            >
              <legend>Map:</legend>
              <Wrapper>
                {(width, height) => (
                  <MapGL
                    width={width}
                    height={height}
                    latitude={loc.latitude}
                    longitude={loc.longitude}
                    zoom={8}
                  />
                )}
              </Wrapper>
            </fieldset>
          </div>
          <div onClick={selectField('cardSets')}>
            <fieldset
              className={cx.field}
              style={display('cardSets')}
              {...setSizeProps('cardSets')}
            >
              <legend>Cardsets:</legend>
              <Tags data={cardSets} />
            </fieldset>
          </div>
          <div onClick={selectField('linkedCards')}>
            <fieldset
              className={cx.field}
              style={display('linkedCards')}
              {...setSizeProps('linkedCards')}
            >
              <legend>Linked Cards</legend>
              <div>
                <Tags data={linkedCards} />
              </div>
            </fieldset>
          </div>
          <div onClick={selectField('comments')} colSpan={2}>
            <fieldset
              className={cx.field}
              style={display('comments')}
              {...setSizeProps('comments')}
            >
              <legend>Comments:</legend>
              <Comments data={comments} />
            </fieldset>
          </div>
        </Grid>
      </div>
    );
  }
}

ReadCardBack.defaultProps = {
  challenge: { type: '0' },
  comments: Comments.defaultProps.data,
  media: PreviewMedia.defaultProps.data,
  cardSets: ['testseries', 'pirateSet'],
  linkedCards: ['Captain hook', 'yeah'],
  loc: { latitude: 0, longitude: 0 },
  author: Profile.defaultProps.data
};

class EditCardBack extends Component {
  static propTypes = {
    key: PropTypes.string.isRequired,
    challenge: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    flipHandler: PropTypes.func.isRequired,
    cardSets: PropTypes.object.isRequired,
    linkedCards: PropTypes.object.isRequireds,
    loc: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    media: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { extended: null };
  }

  render() {
    const { challenge, media, cardSets, linkedCards, loc } = this.props;
    const { extended } = this.state;
    const selectField = field => () =>
      this.setState(prevstate => ({
        extended: prevstate.extended !== field ? field : null
      }));

    const setSizeProps = field => {
      if (field === extended)
        return {
          colSpan: 2,
          rowSpan: 3
        };
      return {};
    };
    const isHidden = field => extended !== null && extended !== field;
    const display = field => ({
      display: isHidden(field) ? 'none' : null
    });

    return (
      <div
        className={`container ${cx.cardMini2} `}
        style={{
          height: '90%',
          zIndex: -10
        }}
      >
        <Grid cols={2} rows={3} gap={1}>
          <div onClick={selectField('author')}>
            <fieldset
              className={cx.field}
              style={display('author')}
              {...setSizeProps('author')}
            >
              <legend>Author:</legend>
              <div style={{ display: 'flex' }}>
                <div>{'Placeholder'}</div>
                <EditButton
                  onClick={() =>
                    this.setState({
                      dialog: { title: 'author', id: 'author', data: '' }
                    })
                  }
                />
              </div>
            </fieldset>
          </div>
          <div onClick={selectField('map')}>
            <fieldset
              className={cx.field}
              style={display('map')}
              {...setSizeProps('map')}
            >
              <legend>Map:</legend>
              <Wrapper>
                {(width, height) => (
                  <MapGL
                    width={width}
                    height={height}
                    latitude={loc.latitude}
                    longitude={loc.longitude}
                    zoom={8}
                  />
                )}
              </Wrapper>
            </fieldset>
          </div>
          <div onClick={selectField('comments')}>
            <fieldset
              colSpan={2}
              className={cx.field}
              style={display('comments')}
              {...setSizeProps('comments')}
            >
              <legend>Comments:</legend>
              {'Placeholder'}
            </fieldset>
          </div>
        </Grid>
      </div>
    );
  }
}

function CardBack(props) {
  return props.edit ? <EditCardBack {...props} /> : <ReadCardBack {...props} />;
}

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

const CollectButton = ({ collected, onClick, expPoints }) => (
  <div className="p-1 pt-3">
    <button
      className={`btn btn-secondary btn-lg btn-block}`}
      style={{ width: '100%', alignSelf: 'flex-end' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span>{'Collect'}</span>
        <div
          style={{
            marginLeft: '4px',
            paddingLeft: '4px',
            paddingRight: '4px',
            border: '1px black solid',
            borderRadius: '5px'
          }}
        >
          {`${expPoints}xp`}
        </div>
      </div>
    </button>
  </div>
);

CollectButton.propTypes = {
  dataTarget: PropTypes.string,
  collected: PropTypes.bool,
  onClick: PropTypes.func,
  expPoints: PropTypes.number
};

CollectButton.defaultProps = {
  collected: false,
  toggleCardChallenge: d => d,
  expPoints: 60
};

class Card extends React.Component {
  static propTypes = {
    onClose: PropTypes.oneOf([null, PropTypes.func]),
    collectHandler: PropTypes.oneOf([null, PropTypes.func]),
    style: PropTypes.object,
    editable: PropTypes.bool
  };
  static defaultProps = {
    onClose: d => d,
    collectHandler: null,
    style: {},
    edit: false
  };

  constructor(props) {
    super(props);
    this.state = {
      frontView: true
    };
  }

  render() {
    const { style, edit, challenge, onAttrUpdate } = this.props;
    const { frontView } = this.state;
    // const { onClose } = this.props;
    const sideToggler = frontView ? cx.flipAnim : null;
    const { onCollect } = this.props;
    const flipHandler = () => {
      this.setState(oldState => ({
        frontView: !oldState.frontView
      }));
    };
    const onAttrUpdateFunc = edit ? { onAttrUpdate } : {};

    const color = colorScale(challenge.type);
    const togglecard = () => {
      if (frontView)
        return (
          <CardFront
            {...this.props}
            edit={edit}
            onCollect={onCollect}
            color={color}
            flipHandler={flipHandler}
            {...onAttrUpdateFunc}
          />
        );
      return (
        <CardHeader {...this.props} flipHandler={flipHandler} color={color}>
          <CardBack {...this.props} edit={edit} />
        </CardHeader>
      );
    };

    // console.log('ToggleCard', ToggleCard);

    return (
      <div className={`${cx.flipContainer} ${sideToggler}`} style={style}>
        <div
          className={`${cx.flipper} ${sideToggler}`}
          style={{
            background: color
          }}
        >
          {togglecard()}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  ...ReadCardFront.propTypes,
  ...ReadCardBack.propTypes
};

Card.defaultProps = {
  ...ReadCardFront.defaultProps,
  ...ReadCardBack.defaultProps
};

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

// CardCont.defaultProps = {
//   selected: true
// };

// CardCont.propTypes = { selected: PropTypes.bool };

export { Card, PreviewCard, TagInput, PlaceholderCard };

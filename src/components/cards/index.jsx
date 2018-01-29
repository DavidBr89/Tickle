import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import MapGL from 'react-map-gl';
import { WithContext as ReactTags } from 'react-tag-input';
// import ClampLines from 'react-clamp-lines';
import 'w3-css';

import { CardMarker } from '../utils/map-layers/DivOverlay';

import Grid from 'mygrid/dist';
// TODO: replace
import * as chromatic from 'd3-scale-chromatic';

import { challengeTypes, mediaTypes, skillTypes } from '../../dummyData';
import cx from './Card.scss';
import colorClasses from '../colorClasses';
// import StarRating from './utils/StarRating';
// import exampleImg from './example_challenge.jpg';
import { Wrapper } from '../utils';

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

const colorClass = () => colorScaleRandom(Math.random() * 30);

const defaultProps = {
  title: 'The peculiar story of Arthur De Greef',
  challenge: { type: 'gap text' },
  date: '28/04/2012 10:00',
  tags: ['Art', 'Culture', 'Music'],
  img:
    'https://drive.google.com/uc?export=view&id=1N9Ed6a_CDa8SEMZeLaxULF4FtkHBQf4Feg',
  xpPoints: 100,
  // TODO: remove in future to component
  description:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
  loc: { latitude: 50.828797, longitude: 4.352191 },
  place: 'Park next to my Home',
  creator: 'Jan',
  radius: 400,
  media: [
    {
      type: 'photo',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    },
    {
      type: 'hyperlink',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    },
    {
      type: 'game',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    }
  ],
  comments: [
    {
      user: 'Nils',
      comment: 'I did not know that he was such a famous composer'
    },
    {
      user: 'Babba',
      comment: 'What a nice park, strange, that they put a mask on his face!'
    }
  ],
  cardSets: ['european_composers'],
  linkedCards: ['Frank Liszt', 'Music school Arthur de Greef']
};

const EditButton = ({ style, onClick }) => (
  <i
    className="fa fa-2x fa-pencil-square-o ml-1"
    style={style}
    onClick={onClick}
  />
);

const Media = ({ data }) => (
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

Media.propTypes = {
  data: PropTypes.array.isRequired,
  extended: PropTypes.bool
};

Media.defaultProps = { data: defaultProps.media, extended: false };

const SmallModal = ({ visible, title, children, content, onClose, onSave }) => (
  <div
    className="modal fade modal-open"
    id="exampleModal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style={{ opacity: visible ? 1 : 0, display: visible ? 'block' : 'none' }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            {title}
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">{content}</div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
);

SmallModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};
SmallModal.defaultProps = {
  visible: true,
  title: '-',
  children: <div>{'test'}</div>,
  onClose: () => null,
  onSave: () => null
};

const CardFront = ({ tags, img, description, media, children }) => (
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
    <div className="mt-1 mb-1">
      <img src={img} alt="Card img" style={{ width: '100%', height: '100%' }} />
    </div>
    <div>
      <fieldset className={cx.field}>
        <legend>description</legend>
        <div className={cx.textClamp}>{description}</div>
      </fieldset>
    </div>
    <div>
      <fieldset className={cx.field}>
        <legend>Media:</legend>
        <Media data={media} />
      </fieldset>
    </div>
    {children}
  </div>
);

CardFront.propTypes = {
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  children: PropTypes.array
};

CardFront.defaultProps = defaultProps;

class EditableCardFront extends Component {
  static propTypes = CardFront.propTypes;
  static defaultProps = CardFront.defaultProps;

  constructor(props) {
    super(props);
    this.state = { data: { ...props }, dialog: null };
  }

  render() {
    // console.log('hey', this.props);
    const {
      tags,
      img,
      description,
      media,
      children,
      challenge
    } = this.state.data;
    const { dialog } = this.state;
    const modalVisible = dialog !== null;
    return (
      <div style={{ height: '100%' }}>
        <SmallModal
          visible={modalVisible}
          onClose={() => this.setState({ dialog: null })}
        >
          {modalVisible ? dialog.content : ''}
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
            <PreviewTags data={tags} />
            <i
              style={{ fontSize: '24px' }}
              className="fa fa-pencil-square-o ml-1"
              onClick={() => this.setState({ title: 'Tags', content: tags })}
            />
          </div>
          <div className="mt-1 mb-1">
            <div
              alt="Card cap"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <div className="mt-1 mb-1">
                <img
                  src="http://via.placeholder.com/450x270"
                  alt="Card img"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
          <div style={{ height: '20%' }}>
            <fieldset className={`${cx.field}`} style={{ height: '90%' }}>
              <legend>description</legend>
              <div
                style={{ display: 'flex', alignContent: 'end', height: '100%' }}
              >
                <div className={cx.textClamp} style={{ height: '100%' }}>
                  {description}
                </div>
                <div>
                  <EditButton
                    onClick={() =>
                      this.setState({
                        dialog: { title: 'description', content: description }
                      })
                    }
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div style={{ height: '15%' }}>
            <fieldset className={cx.field}>
              <legend>Media:</legend>
              <div style={{ display: 'flex', alignContent: 'end' }}>
                <Media />
                <div>
                  <EditButton
                    onClick={() =>
                      this.setState({
                        dialog: { title: 'Media', content: media }
                      })
                    }
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div onClick={() => this.setState({ dialog: true })}>
            <div style={{ display: 'flex', alignContent: 'end' }}>
              <div className="p-1 pt-3" style={{ width: '100%' }}>
                <button
                  className={`btn btn-secondary btn-lg btn-block}`}
                  style={{ width: '100%', alignSelf: 'flex-end' }}
                  onClick={() => null}
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
                      <EditButton
                        onClick={() =>
                          this.setState({
                            dialog: { title: 'Challenge', content: challenge }
                          })
                        }
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

EditableCardFront.defaultProps = defaultProps;

// const EditableCardFront = ({ tags, img, description, media, children }) => (
//   <div
//     className={cx.cardDetail}
//     style={{
//       display: 'flex',
//       flexDirection: 'column',
//       // justifyContent: 'space-between',
//       height: '90%'
//     }}
//   >
//     <PreviewTags data={tags} />
//     <div className="mt-1 mb-1">
//       <div
//         alt="Card cap"
//         style={{
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           alignContent: 'center',
//           alignItems: 'center'
//         }}
//       >
//         <div className="mt-1 mb-1">
//           <img
//             src="http://via.placeholder.com/450x270"
//             alt="Card img"
//             style={{ width: '100%', height: '100%' }}
//           />
//         </div>
//       </div>
//     </div>
//     <div>
//       <fieldset className={cx.field}>
//         <legend>description</legend>
//         <textarea className="form-control" rows="3" />
//       </fieldset>
//     </div>
//     <div>
//       <fieldset className={cx.field}>
//         <legend>Media:</legend>
//         <TagInput />
//       </fieldset>
//     </div>
//     <div onClick={() => this.setState({ dialog: true })}>
//       <fieldset className={cx.field}>
//         <legend>Challenge:</legend>
//       </fieldset>
//     </div>
//     {children}
//   </div>
// );

const Tags = ({ data }) => (
  <div
    style={
      {
        // display: 'flex',
        // flexWrap: 'wrap'
        // alignItems: 'flex-start',
        // alignContent: 'center'
      }
    }
    className={cx.tags}
  >
    {data.map(t => (
      <div key={t + random()} className={`${cx.tag} ${colorClass()}`}>
        <small>{t}</small>
      </div>
    ))}
  </div>
);

const PreviewTags = ({ data }) => (
  <div
    style={{
      display: 'flex'
      // flexWrap: 'no-wrap'
      // alignItems: 'center'
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data.map(t => (
      <small key={t + random()} className={`${cx.tag} ${colorClass()}`}>
        {t}
      </small>
    ))}
  </div>
);

const SmallCategories = ({ data }) => (
  <div className={`${cx.textTrunc} ${cx.tags}`}>
    {data.map(t => (
      <small key={t + random()} className={`${cx.tag} ${colorClass()}`}>
        {t}
      </small>
    ))}
  </div>
);

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
    ...defaultProps,
    style: {},
    selected: false
  };

  shouldComponentUpdate(nextProps) {
    return this.props.selected !== nextProps.selected;
  }

  render() {
    const { title, tags, img, challenge, style, onClick } = this.props;
    return (
      <div
        className={cx.cardMini2}
        style={{
          ...style,
          background: colorScale(challenge.type)
        }}
        onClick={onClick}
      >
        <div className={cx.cardHeader}>
          <h5 className="text-truncate">{title}</h5>
        </div>
        <div>
          <SmallCategories data={tags} />
          <div className="mt-1 mb-1">
            <img
              style={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto'
              }}
              src={img}
              alt="Card cap"
            />
          </div>
        </div>
      </div>
    );
  }
}

const CardFrame = ({
  title,
  img,
  onClose,
  challenge,
  children,
  flipHandler,
  style
  // id
}) => (
  <div
    className={`${cx.cardMini2} `}
    style={{
      background: colorScale(challenge.type),
      overflow: 'hidden',
      height: '100%',
      ...style
    }}
  >
    <div className={cx.cardHeader}>
      <h3 className="text-truncate">{title}</h3>
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

CardFrame.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.array,
  img: PropTypes.string,
  flipHandler: PropTypes.func,
  challenge: PropTypes.object,
  children: PropTypes.node
};

CardFrame.defaultProps = defaultProps;

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

Comments.PropTypes = {
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

  console.log('scale', scale.domain());

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
const Author = ({ profile, extended, onClose }) => {
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
//   profile: PropTypes.shape({
//     name: PropTypes.string,
//     skills: PropTypes.array(
//       PropTypes.shape({ name: PropTypes.string, level: PropTypes.number })
//     ),
//     activity: PropTypes.shape({
//       collectedCards: PropTypes.number,
//       createdCards: PropTypes.number
//     })
//   }),
//   extended: PropTypes.bool
// };

Author.defaultProps = {
  profile: {
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
    activity: { collectedCards: 20, createdCards: 13 }
  },
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

Profile.PropTypes = {
  data: PropTypes.object.isRequired
};

// TODO; rempve
Profile.defaultProps = { name: 'jan', comment: 'yeah' };

class CardBack extends Component {
  static propTypes = {
    key: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    challenge: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    flipHandler: PropTypes.func.isRequired,
    cardSets: PropTypes.array,
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
              profile={author}
              extended={extended === 'author'}
              onClose={() => {
                // TODO
                // console.log('onCLose');
                // this.setState({ extended: null });
              }}
            />
          </div>
          <fieldset
            className={cx.field}
            onClick={selectField('map')}
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

CardBack.defaultProps = {
  challenge: { type: '0' },
  comments: Comments.defaultProps.data,
  media: Media.defaultProps.data,
  cardSets: ['testseries', 'pirateSet'],
  linkedCards: ['Captain hook', 'yeah'],
  loc: { latitude: 0, longitude: 0 },
  author: Profile.defaultProps.data
};

class EditableCardBack extends Component {
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
          <div>
            <fieldset
              className={cx.field}
              style={display('author')}
              {...setSizeProps('author')}
              onClick={selectField('author')}
            >
              <legend>Author:</legend>
              <div style={{ display: 'flex' }}>
                <div>{'Placeholder'}</div>
                <EditButton
                  onClick={() =>
                    this.setState({ dialog: { title: 'author', content: '' } })
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
          <div onClick={selectField('cardSets')}>
            <fieldset
              className={cx.field}
              style={display('cardSets')}
              {...setSizeProps('cardSets')}
            >
              <legend>Cardsets:</legend>
              <Tags data={cardSets} />
              <EditButton
                onClick={() =>
                  this.setState({ dialog: { title: 'author', content: '' } })
                }
              />
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

// CardBack.defaultProps = {
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

const CollectButton = ({ collected, dataTarget, onClick, expPoints }) => (
  <div className="p-1 pt-3">
    <button
      className={`btn btn-secondary btn-lg btn-block}`}
      style={{ width: '100%', alignSelf: 'flex-end' }}
      data-target={dataTarget}
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
  dataTarget: '#exampleModal',
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
    editable: false
  };

  constructor(props) {
    super(props);
    this.state = {
      frontView: true
    };
  }

  render() {
    const { style, editable } = this.props;
    const { frontView } = this.state;
    // const { onClose } = this.props;
    const sideToggler = frontView ? cx.flipAnim : null;
    const { onCollect } = this.props;
    const flipHandler = () => {
      this.setState(oldState => ({
        frontView: !oldState.frontView
      }));
    };
    const ToggleCard = do {
      if (frontView) {
        <CardFrame {...this.props} flipHandler={flipHandler}>
          {editable ? (
            <EditableCardFront {...this.props} />
          ) : (
            <CardFront {...this.props}>
              <CollectButton onClick={onCollect} />
            </CardFront>
          )}
        </CardFrame>;
      } else {
        <CardFrame {...this.props} flipHandler={flipHandler}>
          {editable ? (
            <EditableCardBack {...this.props} />
          ) : (
            <CardBack {...this.props} />
          )}
        </CardFrame>;
      }
    };

    // console.log('ToggleCard', ToggleCard);

    return (
      <div className={`${cx.flipContainer} ${sideToggler}`} style={style}>
        <div
          className={`${cx.flipper} ${sideToggler}`}
          style={{
            background: colorScale(this.props.challenge.type)
          }}
        >
          {ToggleCard}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  ...CardFront.propTypes,
  ...CardBack.propTypes
};

Card.defaultProps = {
  ...CardFront.defaultProps,
  ...CardBack.defaultProps
};

class TagInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [{ id: 1, text: 'Thailand' }, { id: 2, text: 'India' }],
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
    return (
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
    );
  }
}

// CardCont.defaultProps = {
//   selected: true
// };

// CardCont.propTypes = { selected: PropTypes.bool };

export { Card, PreviewCard, TagInput };

import 'w3-css';

import React, { Component, PureComponent } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import MapGL from 'react-map-gl';
import { WithContext as ReactTags } from 'react-tag-input';
import Grid from 'mygrid/dist';
import * as chromatic from 'd3-scale-chromatic';
import chroma from 'chroma-js';

import cxs from 'cxs';
// import ClampLines from 'react-clamp-lines';
// import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import cx from './Card.scss';
import Author from './Author';
import { challengeTypes } from '../../dummyData';
// TODO: rename
import { Wrapper } from '../utils';
import placeholderImg from './placeholder.png';
import { Modal, ModalBody } from '../utils/modal';
import { MediaSearch, MediaOverview } from './MediaSearch';
import {
  FieldSet,
  PreviewMedia,
  MediaField,
  DescriptionField,
  EditButton,
  Img,
  TagInput,
  colorClass,
} from './layout';

const random = () => Math.random() * 1000;

const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};
// console.log('colorClasses', colorClasses);

// console.log('mediaScale', mediaScale('hyperlink'));
const colorScale = d3
  .scaleOrdinal()
  .domain(challengeTypes)
  .range(chromatic.schemePastel1);

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

const cardLayout = cxs({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '90%'
});

const shadowStyle = {
  boxShadow: '9px 9px grey',
  border: '1px solid grey'
};

class ReadCardFront extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    uiColor: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { dialog: null };
  }

  modalReadContent(modalTitle) {
    const { title, tags, description, media, uiColor } = this.props;
    switch (modalTitle) {
      case 'Title':
        return <p style={{ width: '100%' }}>{title}</p>;
      case 'Tags':
        return <p style={{ width: '100%' }}>{tags}</p>;
      case 'Photo':
        return <div>photo</div>;
      case 'Description':
        return <p style={{ width: '100%' }}>{description}</p>;
      case 'Media':
        return (
          <div>
            <MediaOverview data={media} color={uiColor} />
          </div>
        );
      case 'Challenge':
        return <div>challenge</div>;
      default:
        return <div>error</div>;
    }
  }

  render() {
    const { tags, img, description, media, onCollect, uiColor } = this.props;

    const { dialog } = this.state;
    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.title : null;
    return (
      <div className={cardLayout}>
        <Modal
          visible={modalVisible}
          title={dialogTitle}
          onClose={() => this.setState({ dialog: null })}
        >
          <ModalBody>{this.modalReadContent(dialogTitle)}</ModalBody>
        </Modal>
        <PreviewTags data={tags} />

        <Img src={img} />
        <DescriptionField
          text={description}
          color={uiColor}
          onClick={() =>
            this.setState({
              dialog: { title: 'Description', data: description }
            })
          }
        />
        <MediaField
          media={media}
          color={uiColor}
          onClick={() =>
            this.setState({ dialog: { title: 'Media', data: media } })
          }
        />
        <CollectButton onClick={onCollect} color={uiColor} />
      </div>
    );
  }
}

ReadCardFront.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  onCollect: PropTypes.func,
  children: PropTypes.array,
  onClose: PropTypes.func,
  flipHandler: PropTypes.func,
  style: PropTypes.object,
  background: PropTypes.string
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

  extendFieldState(field) {
    this.setState(oldState => ({
      data: { ...oldState.data, ...field }
    }));
  }

  modalWriteContent(modalTitle) {
    const { data } = this.state;
    const { uiColor } = this.props;
    // TODO: img
    const { title, tags, img, description, media, challenge } = data;
    switch (modalTitle) {
      case 'Title':
        return (
          <ModalBody
            color={uiColor}
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
            color={uiColor}
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
            <MediaSearch
              media={media}
              color={uiColor}
              onSubmit={mediaItems => {
                this.setFieldState({ media: mediaItems });
              }}
            />
          </div>
        );
      case 'Challenge':
        return <div>challenge</div>;
      default:
        return <div>error</div>;
    }
  }

  render() {
    const { onClose, flipHandler, style, background, uiColor } = this.props;
    const { data } = this.state;
    const { title, tags, img, description, media, children, challenge } = data;
    const { dialog } = this.state;
    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.title : null;
    // const background = colorScale(challenge.type);
    // const modalStyle = modalVisible
    //   ? { background: 'black', opacity: 0.5 }
    //   : {};
    return (
      <CardHeader
        edit
        title={title}
        onClose={onClose}
        background={background}
        onEdit={() =>
          this.setState({
            dialog: { title: 'Title', data: title }
          })
        }
        flipHandler={flipHandler}
        style={style}
      >
        <div className="ml-1 mr-1" style={{ height: '100%' }}>
          <Modal
            visible={modalVisible}
            title={modalVisible ? dialog.title : ''}
            onClose={() => this.setState({ dialog: null })}
          >
            {this.modalWriteContent(dialogTitle)}
          </Modal>
          <div className={cardLayout}>
            <div style={{ display: 'flex' }}>
              {tags.length !== 0 ? (
                <PreviewTags data={tags} />
              ) : (
                <div>{'Add a tag'}</div>
              )}
              <EditButton
                style={{ fontSize: '24px' }}
                onClick={() => {
                  this.setState({
                    dialog: { title: 'Tags', data: tags }
                  });
                }}
              />
            </div>
            <Img src={img} />
            <DescriptionField
              text={description}
              color={uiColor}
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

            <MediaField
              media={media}
              color={uiColor}
              onEdit={() =>
                this.setState({
                  dialog: { title: 'Media', data: media }
                })
              }
            />
            <div>
              <div style={{ display: 'flex', alignContent: 'end' }}>
                <div className="p-1 pt-3" style={{ width: '100%' }}>
                  {/* TODO: make component */}
                  <CollectButton
                    onClick={() =>
                      this.setState({
                        dialog: { title: 'Challenge', data: challenge }
                      })
                    }
                  />
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
  props.edit ? (
    <EditCardFront {...props} />
  ) : (
    <CardHeader {...props}>
      <ReadCardFront {...props} />
    </CardHeader>
  );

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
      backfaceVisibility: 'hidden',
      height: '100%',
      background: challengeType ? colorScale(challengeType) : 'lightgrey',
      ...shadowStyle
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
          ...shadowStyle
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
  children,
  flipHandler,
  edit,
  onEdit,
  style,
  background
  // id
}) => (
  <div
    className={`${cx.cardMini2}`}
    style={{
      background,
      overflow: 'hidden',
      height: '100%',
      ...style,
      ...shadowStyle
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%'
      }}
    >
      {/* TODO: cleaner solution */}
      <button className="close" onClick={flipHandler}>
        <i className="fa fa-retweet fa-lg mr-1" aria-hidden="true" />
      </button>
      <div style={{ display: 'inline-flex', width: '80%' }}>
        <h3 className="text-truncate" style={{ marginBottom: '10px' }}>
          {title}
        </h3>
        {edit && <EditButton className="mr-2" onClick={onEdit} />}
      </div>
      <button className="close mr-2" onClick={onClose}>
        <i className="fa fa-window-close fa-lg" aria-hidden="true" />
      </button>
    </div>
    {children}
  </div>
);

CardHeader.propTypes = {
  title: PropTypes.string,
  // tags: PropTypes.array,
  // img: PropTypes.string,
  flipHandler: PropTypes.func,
  background: PropTypes.string,
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
  onEdit: () => null,
  background: 'tomato'
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

class ReadCardBack extends Component {
  static propTypes = {
    comments: PropTypes.array.isRequired,
    author: PropTypes.object.isRequired,
    flipHandler: PropTypes.func.isRequired,
    linkedCards: PropTypes.array,
    loc: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    uiColor: PropTypes.string
  };

  static defaultProps = {
    linkedCards: [],
    loc: { latitude: 0, longitude: 0 },
    uiColor: 'grey'
  };

  constructor(props) {
    super(props);
    this.state = { extended: null };
  }

  render() {
    const {
      cardSets,
      linkedCards,
      loc,
      author,
      uiColor,
      comments
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
            <FieldSet legend={'Author'} color={uiColor}>
              <Author
                {...author}
                extended={extended === 'author'}
                onClose={() => {
                  // TODO
                  // console.log('onCLose');
                  // this.setState({ extended: null });
                }}
              />
            </FieldSet>
          </div>
          <div onClick={selectField('map')} {...setSizeProps('map')}>
            <FieldSet
              style={display('map')}
              legend={'Map radius'}
              color={uiColor}
            >
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
            </FieldSet>
          </div>
          <div onClick={selectField('cardSets')} {...setSizeProps('cardSets')}>
            <FieldSet
              style={display('cardSets')}
              legend={'CardSets'}
              color={uiColor}
            >
              <Tags data={cardSets} />
            </FieldSet>
          </div>
          <div
            onClick={selectField('linkedCards')}
            {...setSizeProps('linkedCards')}
          >
            <FieldSet
              legend={'linkedCards'}
              style={display('linkedCards')}
              color={uiColor}
            >
              <div>
                <Tags data={linkedCards} />
              </div>
            </FieldSet>
          </div>
          <div
            onClick={selectField('comments')}
            colSpan={2}
            {...setSizeProps('comments')}
          >
            <FieldSet
              legend={'Comments'}
              style={display('comments')}
              color={uiColor}
            >
              <Comments data={comments} />
            </FieldSet>
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
  author: {}
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
    const {
      challenge,
      media,
      cardSets,
      linkedCards,
      loc,
      uiColor
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
        <Grid cols={1} rows={3} gap={1}>
          <div
            onClick={selectField('author')}
            style={display('author')}
            {...setSizeProps('author')}
          >
            <FieldSet legend={'Author'} color={uiColor}>
              <Author />
            </FieldSet>
          </div>
          <div
            onClick={selectField('map')}
            style={display('map')}
            {...setSizeProps('map')}
          >
            <FieldSet legend={'Map:'}>
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
            </FieldSet>
          </div>
          <div
            onClick={selectField('comments')}
            colSpan={2}
            style={display('comments')}
            {...setSizeProps('comments')}
          >
            <FieldSet legend={'Comments'}>{'Placeholder'}</FieldSet>
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

const CollectButton = ({ collected, onClick, expPoints, color }) => (
  <div className="p-1 pt-3">
    <button
      className={`btn btn-active btn-lg btn-block}`}
      style={{ width: '100%', alignSelf: 'flex-end', background: color }}
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
  collected: PropTypes.bool,
  onClick: PropTypes.func,
  expPoints: PropTypes.number,
  color: PropTypes.string
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

    const background = colorScale(challenge.type);
    const uiColor = chroma(background).darken(1);
    console.log('background', background);

    const togglecard = () => {
      if (frontView)
        return (
          <CardFront
            {...this.props}
            edit={edit}
            onCollect={onCollect}
            background={background}
            flipHandler={flipHandler}
            uiColor={uiColor}
            {...onAttrUpdateFunc}
          />
        );
      return (
        <CardHeader
          {...this.props}
          flipHandler={flipHandler}
          background={background}
        >
          <CardBack {...this.props} edit={edit} uiColor={uiColor}
          />
        </CardHeader>
      );
    };

    // console.log('ToggleCard', ToggleCard);

    return (
      <div className={`${cx.flipContainer} ${sideToggler}`} style={style}>
        <div
          className={`${cx.flipper} ${sideToggler}`}
          style={{
            background
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


// CardCont.defaultProps = {
//   selected: true
// };

// CardCont.propTypes = { selected: PropTypes.bool };

export { Card, PreviewCard, PlaceholderCard };

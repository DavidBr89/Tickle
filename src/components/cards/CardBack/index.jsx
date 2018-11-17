import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Minimize from 'react-feather/dist/icons/minimize';
import Maximize from 'react-feather/dist/icons/maximize';

import CardControls from 'Components/cards/CardControls';
import Comments from './Comments';
import RelatedTags from './RelatedTags';
import BackAuthor from './BackAuthor';
import { MapAreaControl } from './MapAreaControl';

//

const BackField = ({
  onClick,
  onControlClick,
  style,
  title,
  legendStyle,
  className,
  icon,
  children,
  disabled,
  extended
}) => (
  <div
    className={`overflow-hidden relative flex-col-wrapper ${className}`}
    onClick={!extended ? onClick : () => null}
    style={{
      ...style
    }}
  >
    <div
      className="mb-1 z-10 absolute flex-grow flex justify-end items-center"
      style={{ right: 0 }}
    >
      <button
        type="button"
        className="btn bg-white m-2"
        onClick={extended ? onClick : () => null}
      >
        {extended ? <Minimize /> : <Maximize />}
      </button>
    </div>
    {children}
  </div>
);

BackField.defaultProps = {
  onClick: d => d,
  onControlClick: d => d,
  style: {},
  className: '',
  children: null,
  disabled: false,
  extended: false
};


class CardBack extends Component {
  static propTypes = {
    comments: PropTypes.array.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      uid: PropTypes.string,
      usrImgUrl: PropTypes.oneOf(null, PropTypes.string)
    }),
    onFlip: PropTypes.func.isRequired,
    linkedCards: PropTypes.array,
    cardSets: PropTypes.array,
    loc: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    uiColor: PropTypes.string,
    edit: PropTypes.bool,
    mapRadius: PropTypes.number,
    setMapRadius: PropTypes.func,
    onDelete: PropTypes.func
  };

  static defaultProps = {
    linkedCards: [],
    loc: { latitude: 0, longitude: 0 },
    cardSets: [],
    edit: false,
    onFlip: d => d,
    mapRadius: 100,
    setMapRadius: d => d,
    onDelete: d => d
  };

  state = { extended: null };

  selectField = (field) => {
    this.setState(({ extended: prevExtended }) => ({
      extended: prevExtended !== field ? field : null
    }));
  };

  render() {
    const {
      loc, edit, setMapRadius, mapRadius, onFlip, onDelete,
      id: cardId, uid, style, onClose, className, tags, tagVocabulary,
      authorDataPromise, commentPromises, addComment, authUser, controls
    } = this.props;

    const { extended } = this.state;

    const isExtended = field => extended === field && extended !== null;

    const displayStyle = (field) => {
      // const fieldExtended = isExtended(field);
      const flexStyle = () => {
        if (extended === null) return '0 10 25%';
        return extended === field ? '1 0 75%' : '0 10 0%';
      };
      return {
        transition: 'all 0.2s',
        flex: flexStyle()
        // overflow: fieldExtended ? 'scroll' : 'hidden'
      };
    };

    return (
      <div className={`flex flex-col flex-grow ${className}`}>
        <div className="flex-grow m-2 relative">
          <div className="absolute h-full w-full flex-col-wrapper ">
            <BackField
              className="mb-2"
              style={displayStyle('author')}
              onClick={() => this.selectField('author')}
            >
              <BackAuthor
                uid={uid}
                extended={extended === 'author'}
                dataPromise={authorDataPromise}
              />
            </BackField>
            <BackField
              className="mb-2"
              style={displayStyle('tags')}
              onClick={() => this.selectField('tags')}
            >
              <RelatedTags tags={tags} tagVocabulary={tagVocabulary} {...this.props}></RelatedTags>
            </BackField>

            <BackField
              className="relative mb-2"
              onClick={() => this.selectField('map')}
              extended={extended === 'map'}
              style={displayStyle('map')}
            >
              <MapAreaControl {...this.props} />
            </BackField>
            <BackField
              className="relative"
              extended={isExtended('comments')}
              onClick={() => this.selectField('comments')}
              style={displayStyle('comments')}
            >
              <Comments
                author={authUser}
                cardId={cardId}
                extended={extended === 'comments'}
                commentPromises={commentPromises}
                addComment={addComment}
              />
            </BackField>
          </div>
        </div>
        <CardControls
          onFlip={onFlip}
          onClose={onClose}
          style={{ width: '100%', flexShrink: 0 }}
        >
          {controls}
        </CardControls>
      </div>
    );
  }
}

CardBack.propTypes = {
  onFlip: PropTypes.func,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  uiColor: PropTypes.string,
  setMapRadius: PropTypes.func
};

CardBack.defaultProps = {
  onFlip: d => d,
  edit: false,
  onClose: d => d,
  background: 'black',
  uiColor: 'black',
  title: null,
  setMapRadius: d => d
};

export default CardBack;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {wrapGrid} from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';
import ConnectedCard from 'Components/cards/ConnectedCard';

import {BlackModal} from 'Utils/Modal';
import DefaultLayout from 'Components/DefaultLayout';
// import BookWidget from 'Components/BookWidgets';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUBMITTED,
  CHALLENGE_SUCCEEDED,
  NO_CARD_FILTER,
  // challengeTypeMap
} from 'Constants/cardFields';
import TabMenu from './TabMenu';

// import './layout.scss';

class Cell extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    selected: PropTypes.bool,
  };

  static defaultProps = {
    onClick: () => null,
    selected: true,
  };

  state = {hovered: false};

  render() {
    const {onClick, style, selected, expanded, seen, ...restProps} = this.props;
    const {hovered} = this.state;

    return (
      <div
        style={{
          padding: '5%',
          cursor: 'pointer',
          zIndex: hovered && 2000,
          width: '100%',
          height: '100%',
          transition: 'opacity 500ms',
          // background: selected && 'black',
          ...style,
        }}
        onClick={onClick}>
        <div
          style={{
            // IMPORTANT FOR ANIMATION
            width: '100%',
            height: '100%',
          }}>
          <PreviewCard
            {...this.props}
            accessible={seen}
            key={this.props.id}
            onClick={null}
          />
        </div>
      </div>
    );
  }
}

const INITIAL_GRID_STATE = {
  colNum: 10,
  rowNum: 10,
};

const cardTypeText = cardType => {
  switch (cardType) {
    case CHALLENGE_STARTED:
      return 'started';
    case CHALLENGE_SUBMITTED:
      return 'submitted';
    case CHALLENGE_SUCCEEDED:
      return 'collected';
    case NO_CARD_FILTER:
      return 'discovered';
  }
};

export default class MyDiary extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // TODO check later
    // this.fg = wrapGrid(this.grid);
  }

  state = INITIAL_GRID_STATE;

  componentDidUpdate(prevProps, prevState) {
    // this.fg.forceGridAnimation();
  }

  render() {
    const {
      cards,
      selectedCardId,
      selectCard,
      extendCard,
      selectedCard,
      selectedTags,
      relatedTags,
      height,
      cardExtended,
      selectCardType,
      selectedCardType,
      numCollectibleCards,
      numSeenCards,
      tagVocabulary,
      tabExtended,
      extendTab,
    } = this.props;

    const gridStyle = {
      // height: '100%',
      display: 'grid',
      // gridAutoFlow: 'column dense',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gridAutoRows: 150,
    };

    const cardSelected = selectedCardId !== null;
    const flexShrink = ' 0 1000 0%';

    const flexTrans = {
      transition: 'flex 0.5s',
      // flex: tabExtended ? '1000 0 0%' : '0 1000 0%',
    };
    return (
      <DefaultLayout
        menu={
          <div className="flex-grow flex justify-end items-center">
            <select
              className="form-control bg-white"
              onChange={e => selectCardType(e.target.value)}>
              <option
                selected={selectedCardType === NO_CARD_FILTER}
                value={NO_CARD_FILTER}>
                All Cards
              </option>
              <option
                selected={selectedCardType === CHALLENGE_STARTED}
                value={CHALLENGE_STARTED}>
                Started Cards
              </option>
              <option
                selected={selectedCardType === CHALLENGE_SUBMITTED}
                value={CHALLENGE_SUBMITTED}>
                Submitted Cards
              </option>
              <option
                selected={selectedCardType === CHALLENGE_SUCCEEDED}
                value={CHALLENGE_SUCCEEDED}>
                Collected Cards
              </option>
            </select>
          </div>
        }>
        <BlackModal
          visible={cardExtended}
          uiColor="grey"
          background="transparent"
          style={{margin: 'auto'}}>
          {selectedCardId && <ConnectedCard {...selectedCard} />}
        </BlackModal>

        <div className="relative h-full w-full">
          <div
            className={`absolute h-full w-full flex flex-col justify-end z-50`}>
            <TabMenu
              className={`p-2 flex flex-col overflow-y-auto bg-grey-lighter ${
                tabExtended ? 'flex-grow' : 'flex-shrink'
              } `}
              style={{...flexTrans}}
              extended={tabExtended}
              onToggle={extendTab}
              onHeaderClick={() => selectCard(null)}
              selectedTags={selectedTags}
              relatedTags={relatedTags}
              selectedCard={selectedCard}
              nestedTags={tagVocabulary}
            />
          </div>
          <div className="content-margin">
            <div>
              Your {cardTypeText(selectedCardType)} {numSeenCards}/
              {`${numCollectibleCards} `}
              cards
            </div>
            <div
              className="overflow-y-auto"
              style={{flex: tabExtended ? flexShrink : '1 1 0%', ...flexTrans}}>
              <div style={gridStyle} ref={el => (this.grid = el)}>
                {cards.map(d => (
                  <Cell
                    key={d.id}
                    {...d}
                    style={{
                      transformOrigin: null,
                      transform:
                        selectedCardId === d.id ? 'scale(1.1)' : 'scale(1)',
                      zIndex: selectedCardId === d.id ? 2 : 0,
                      transition: 'transform 500ms',
                    }}
                    onClick={() => console.log('click click')}
                    expanded={cardSelected}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

import React, {Component, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from 'Components/DefaultLayout';
import {BlackModal} from 'Utils/Modal';

import EditCard from 'Components/cards/ConnectedEditCard';

import {DropDown} from 'Utils/TagInput';
import {SelectInput} from 'Components/utils/SelectField';
import mbxGeoCoding from '@mapbox/mapbox-sdk/services/geocoding';
import CardStackContainer from '../CardStack';

// import CardDragAuthorOverlay from './CardDragAuthorOverlay';

import CardTagSearch from '../CardTagSearch';

const directionService = mbxGeoCoding({
  accessToken: process.env.MapboxAccessToken,
});

const SelectPlace = ({onChange, className, ...props}) => {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);

  useEffect(
    () => {
      directionService
        .forwardGeocode({
          query,
          limit: 5,
        })
        .send()
        .then(response => {
          const match = response.body;
          if (match.features) setMatches(match.features);
          console.log('match', match);
        });
    },
    [query],
  );

  return (
    <SelectInput
      className={className}
      values={matches}
      onInputChange={t => setQuery(t)}
      onIdChange={id => {
        const m = matches.find(d => d.id === id);
        onChange(m);
      }}
      accId={d => d.id}
      accInputVal={d => d.place_name}
      ChildComp={d => <div>{d.place_name}</div>}
    />
  );
};

const GoToPlace = ({onChange, ...props}) => {
  const [loc, setLoc] = useState({longitude: 0, latitude: 0});

  return (
    <form
      className="flex"
      onSubmit={e => {
        e.preventDefault();
        onChange(loc);
      }}>
      <SelectPlace
        className=""
        {...props}
        onChange={place =>
          setLoc({longitude: place.center[0], latitude: place.center[1]})
        }
      />
      <button type="submit" className="btn btn-black">
        Go
      </button>
    </form>
  );
};

// import DragLayer from './DragAndDrop/DragLayer';

// import { StyledButton } from 'Utils/StyledComps';

//   [
//   '#7fcdbb',
//   '#a1dab4',
//   '#41b6c4',
//   '#a1dab4',
//   '#41b6c4',
//   '#2c7fb8',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#2c7fb8',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#1d91c0',
//   '#225ea8',
//   '#edf8b1',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#1d91c0',
//   '#225ea8',
//   '#edf8b1',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#1d91c0',
//   '#225ea8',
//   '#253494'
// ].map(c => chroma(c).alpha(0.1));

// const TimoutGrid = ReactTimeout(CardStack);

class CardAuthorPage extends Component {
  static propTypes = {
    cards: PropTypes.array,
    cardSets: PropTypes.array,
    selectedTags: PropTypes.array,
    selectedCardId: PropTypes.oneOf([PropTypes.string, null]),
    width: PropTypes.number,
    height: PropTypes.number,
    authEnv: PropTypes.boolean,
    dataView: PropTypes.boolean,
    previewCardAction: PropTypes.func,
    selectCard: PropTypes.func,
    filterCards: PropTypes.func,
    addCardFilter: PropTypes.func,
    filterSet: PropTypes.func,
    toggleAuthEnv: PropTypes.func,
    tagColorScale: PropTypes.func,
    screenResize: PropTypes.func,
    fetchCards: PropTypes.func,
  };

  static defaultProps = {
    cards: [],
    cardSets: [],
    selectedTags: [],
    selectedCardId: null,
    width: 500,
    height: 500,
    authEnv: false,
    dataView: 'geo',
    previewCardAction: d => d,
    selectCard: d => d,
    filterCards: d => d,
    addCardFilter: d => d,
    filterSet: d => d,
    toggleAuthEnv: d => d,
    tagColorScale: () => 'green',
    screenResize: d => d,
    fetchCards: d => d,
    preSelectCardId: d => d,
  };

  componentDidMount() {
    const {
      screenResize,
      fetchCards,
      preSelectCardId,
      userMove,
      changeMapViewport,
    } = this.props;
  }

  componentWillUnmount() {}

  render() {
    const {
      cards,
      selectedCardId,
      // width,
      height,
      authEnv,
      previewCardAction,
      selectCard,
      filterCards,
      addCardFilter,
      dataView,
      filterSet,
      toggleAuthEnv,
      filterByTag,
      cardSets,
      selectedTags,
      selectedCard,
      isSmartphone,
      tagVocabulary,
      extCardId,
      children,
      selectTemplate,
      templateSelected,
      cardStackBottom,
      width,
      centerTemplatePos,
    } = this.props;

    const slotSize = 100 / 3.5;

    return (
      <DefaultLayout
        className="relative overflow-hidden w-full h-full flex-col"
        menu={
          <div className="flex-grow flex justify-between items-center">
            <button
              type="button"
              className={`btn btn-white ml-3 ${templateSelected &&
                'btn-black'}`}
              onClick={selectTemplate}>
              New Card
            </button>

            <GoToPlace onChange={centerTemplatePos} />
            <CardTagSearch
              tags={tagVocabulary}
              filterSet={filterSet}
              onClick={filterByTag}
            />
          </div>
        }>
        <BlackModal visible={extCardId !== null}>
          {selectedCard !== null && <EditCard {...selectedCard} />}
        </BlackModal>
        <CardStackContainer
          bottom={cardStackBottom}
          cards={cards}
          selectedCardId={selectedCardId}
          touch={isSmartphone}
          duration={600}
          width={width}
          height={height}
          unit="%"
          onClick={previewCardAction}
          slotSize={slotSize}
          style={{
            zIndex: 1000,
          }}
        />
        {children}
      </DefaultLayout>
    );
  }
}

export default CardAuthorPage;
// export default withAuthorization(authCondition)(CardAuthorPage);

// export default MapView;

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {PreviewCardSwitch} from 'Components/cards/PreviewCard';

import {BlackModal, ModalBody} from 'Components/utils/Modal';
import MetaCard from 'Components/cards';

const summaryClass = 'mb-3';

const TemplateEditor = (props) => {
  const {templateFields=[]} = props;

  return <div>{
    templateFields.map(d => <div>{d.key}</div>)


  }</div>
}

export default function CardPanel(props) {
  const {
    className,
    cards,
    onCreateCard,
    templateCard,
    selectedUserId,
    urlConfig
  } = props;

  const {
    query: {selectedCardId, extended: cardExtended, flipped},
    routing: {routeSelectExtendCard, routeExtendCard}
  } = urlConfig;

  const tmpCards = !selectedUserId ? [...cards, templateCard] : cards;

  const selectedCard =
    tmpCards.find(c => c.id === selectedCardId) || null;

  const [panelOpen, setPanelOpen] = useState(false);
  const [templateExtended, toggleTemplateExtended] = useState(false);

  const h = 10;
  const gridStyle = {
    justifyContent: 'center',
    display: 'grid',
    gridGap: 16,
    // gridAutoFlow: 'column dense',
    gridTemplateColumns: 'repeat(auto-fit, 10rem)',
    gridAutoRows: `minmax(${h}rem, 1fr)`,
    gridTemplateRows: `minmax(${h}rem, 1fr)`
  };

  return (
    <details className={className} panelOpen={panelOpen}>
      <summary
        className={summaryClass}
        onClick={() => setPanelOpen(!panelOpen)}>
        Cards
      </summary>
      <div className="flex justify-end">
        <button className="btn border " type="button">
          Card Template Editor
        </button>
      </div>
      <div className="flex flex-wrap" style={{...gridStyle}}>
        {tmpCards.length === 0 && (
          <div className="text-4xl self-center">No Cards</div>
        )}
        {tmpCards.map(c => (
          <PreviewCardSwitch
            edit={c.edit}
            title={c.title.value}
            onClick={() => routeSelectExtendCard(c.id)}
          />
        ))}
      </div>
      <BlackModal key="cardPanel" visible={cardExtended}>
        {cardExtended && (
          <MetaCard {...selectedCard} onCreateCard={onCreateCard} />
        )}
      </BlackModal>
      <BlackModal visible={templateExtended}>
        <TemplateEditor/>
      </BlackModal>
    </details>
  );
}

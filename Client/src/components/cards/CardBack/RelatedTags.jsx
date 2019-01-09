import React, {memo, useState, useEffect} from 'react';

import PropTypes from 'prop-types';
import intersection from 'lodash/intersection';
import PreviewCard from 'Components/cards/PreviewCard';
import PreviewCardStack from 'Components/cards/PreviewCardStack';
import {BlackModal, ModalBody} from 'Components/utils/Modal';
import cardRoutes from 'Src/Routes/cardRoutes';

import {withRouter} from 'react-router-dom';

import ConnectedCard from 'Cards/ConnectedCard';

const gridStyle = {
  display: 'grid',
  gridGap: 10,
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))',
  gridAutoRows: 160,
};

const CardsModal = ({
  visible,
  title,
  tagId,
  children,
  onClose,
  onSelectCard,
}) => (
  <BlackModal visible={visible} title={title}>
    <ModalBody onClose={onClose} title={tagId}>
      <div className="bg-white flex-grow" style={gridStyle}>
        {children}
      </div>
    </ModalBody>
  </BlackModal>
);

const RelatedTags = ({
  history,
  location,
  collectibleCards,
  tags,
  tagVocabulary = [],
}) => {
  const [selectedTagId, setSelectedTagId] = useState(null);

  const {
    routing: {routeSelectCard, routeExtendCard},
  } = cardRoutes({history, location});

  const modalVisible = selectedTagId !== null;
  const tagObj = tagVocabulary.find(d => d.tagId === selectedTagId) || null;

  return (
    <div className="m-2 flex-grow flex flex-col">
      <div className="flex flex-no-shrink mb-2">
        <h2 className="tag-label bg-black">Related Cards</h2>
      </div>
      <div className="flex flex-no-shrink">
        {tags.map(t => (
          <div className="tag-label bg-black m-1">{t.tagId}</div>
        ))}
      </div>

      <div className="flex-grow" style={gridStyle}>
        {tags.length === 0 && <div className="text-2xl w-full">No Cards</div>}
        {tags.map(d => (
          <PreviewCardStack
            id={d.tagId}
            onClick={() => {
              setSelectedTagId(d.tagId);
            }}
          />
        ))}
      </div>
      <CardsModal
        key="cardsModal"
        title="Related Cards"
        onClose={() => setSelectedTagId(null)}
        visible={modalVisible}>
        {tagObj &&
          tagObj.values.map(d => (
            <PreviewCard
              title={d.title.value}
              onClick={() => {
                setSelectedTagId(null);
                routeSelectCard(d.id);
                // onSelectCard(d.id);
              }}
            />
          ))}
      </CardsModal>
    </div>
  );
};

const RelatedTagsWithRouter = withRouter(RelatedTags);
export default RelatedTags;

// import React, { Fragment, Component } from 'react';
//
// import DataOverlay from '../ForceOverlay/DataOverlay';
// // TODO integrate
// // import Marker from '../Marker';
// import CardMarker from 'Components/cards/CardMarker';
//
// import { Modal, BareModal, ModalBody } from 'Utils/Modal';
//
// // import ConnectedCard from 'Cards/ConnectedCard';
// // import { Modal, BareModal, ModalBody } from 'Utils/Modal';
//
// const CardViewOverlay = props => {
//   const {
//     onCardDrop,
//     isCardDragging,
//     width,
//     height,
//     cardSets,
//     selectedTags,
//     selectedCardId,
//     filterSet,
//     userLocation,
//     dataView,
//     changeMapViewport,
//     tagColorScale,
//     authEnv,
//     extCardId,
//     extendSelectedCard,
//     createCard,
//     toggleCardChallenge,
//     onCardUpdate,
//     cards,
//     style,
//     iOS,
//     smallScreen,
//     className,
//     previewCardAction,
//     selectedCardLocked,
//     routeSelectCard
//   } = props;
//
//   return (
//     <DataOverlay
//       className={className}
//       style={style}
//       disabled={isCardDragging}
//       width={width}
//       height={height}
//       data={cards}
//       sets={cardSets}
//       selectedTags={selectedTags}
//       selectedCardId={selectedCardId}
//       extCardId={extCardId}
//       filterSet={filterSet}
//       userLocation={userLocation}
//       routeSelectCard={routeSelectCard}
//       userview
//       mode={dataView}
//       padding={{
//         bottom: height / 5,
//         top: height / 5,
//         left: width / 5,
//         right: width / 5
//       }}
//       colorScale={tagColorScale}
//     >
//       {d => (
//         <CardMarker
//           onClick={e => {
//             e.stopPropagation();
//             previewCardAction(d);
//           }}
//           color="whitesmoke"
//           style={{
//             position: 'absolute',
//             left: d.x,
//             top: d.y,
//             transform: 'translate(-50%, -50%)',
//             // TODO: zIndex not working
//             width: selectedCardId === d.id ? 40 : 25,
//             height: selectedCardId === d.id ? 50 : 30,
//             zIndex: selectedCardId === d.id ? 1 : 0
//             // transition: 'width 300ms, height 300ms'
//             // transform: selectedCardId === d.id && 'scale(2)'
//           }}
//         />
//       )}
//     </DataOverlay>
//   );
// };
//
// export default CardViewOverlay;

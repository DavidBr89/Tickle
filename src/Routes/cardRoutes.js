import {matchPath} from 'react-router';
import queryString from 'query-string';

export default function cardRoutes({
  path,
  location: {pathname, search},
  history
}) {
  const {
    selectedCardId = null,
    extended = null,
    flipped = null
  } = queryString.parse(search);

  const cardParam = id => (id !== null ? `selectedCardId=${id}` : '');

  const extParam = ext => (ext ? `&extended=${true}` : '');

  const routeSelectCard = (cardId = null) => {
    history.push(`${pathname}?${cardParam(cardId)}`); //
  };

  const routeExtendCard = () => {
    const newExt = extended === null;
    console.log('extended', extended, newExt);
    const newExtendedParam = extParam(newExt);
    console.log('newExtendedParam', newExtendedParam);

    history.push(`${pathname}?${cardParam(selectedCardId)}${newExtendedParam}`); //
  };

  // const routeLockedCard = id => {
  //   history.push(`${path}/${id}/locked`);
  //   // dispatch(extendSelectedCard(id));
  // };

  const routeFlipCard = () => {
    const newFlipped = !flipped;
    console.log('routing flipCard');
    console.log('search', search, 'pathname', pathname);
    console.log('flipped', flipped, 'newFlipped', newFlipped);
    const newFlippedParam = newFlipped ? `&flipped=${true}` : '';

    history.push(
      `${pathname}?${cardParam(selectedCardId)}${extParam(
        extended,
      )}${newFlippedParam}`,
    );
    // dispatch(flipCard(!flipped));
  };
  return {
    query: {
      selectedCardId,
      extended,
      flipped,
    },
    routing: {
      routeSelectCard,
      routeExtendCard,
      routeFlipCard
    }
  };
}

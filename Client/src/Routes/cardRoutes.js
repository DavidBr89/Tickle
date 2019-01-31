import queryString from 'query-string';

export default function cardRoutes({
  path,
  location: {pathname, search},
  history,
}) {
  const {
    selectedCardId = null,
    extended = null,
    flipped = null,
  } = queryString.parse(search);

  const cardParam = id => (id !== null ? `selectedCardId=${id}` : '');

  const extParam = ext => (ext ? `&extended=${true}` : '');

  const routeSelectCard = (cardId = null) => {
    history.push(`${pathname}?${cardParam(cardId)}`); //
  };

  const routeExtendCard = () => {
    const newExt = extended === null;
    const newExtendedParam = extParam(newExt);

    history.push(`${pathname}?${cardParam(selectedCardId)}${newExtendedParam}`); //
  };

  const routeSelectExtendCard = (cardId = null) => {
    const newExt = extended === null;
    const newExtendedParam = extParam(newExt);

    history.push(`${pathname}?${cardParam(cardId)}${newExtendedParam}`); //
  };

  // const routeLockedCard = id => {
  //   history.push(`${path}/${id}/locked`);
  //   // dispatch(extendSelectedCard(id));
  // };

  const routeFlipCard = () => {
    const newFlipped = !flipped;
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
      routeFlipCard,
      routeSelectExtendCard,
    },
  };
}

import {matchPath} from 'react-router';

export default function cardRoutes({
  basePathName,
  path,
  match: {url},
  history
}) {
  const {params} = matchPath(url, {path});

  const constructPath = ({...rest}) => {
    const {selectedCardId = null, extended = null, flipped = null} = params;

    const bp = basePathName(params);

    if (selectedCardId) {
      if (extended) {
        if (flipped) {
          return `${bp}/${selectedCardId}/${extended}/${flipped}`;
        }
        return `${bp}/${selectedCardId}/${extended}`;
      }
      return `${bp}/${selectedCardId}`;
    }
    return bp;
  };

  const routeSelectCard = selectedCardId => {
    const {params} = matchPath(url, {path});

    history.push(constructPath({selectedCardId})); //
    // dispatch(selectCard(id));
  };

  const routeExtendCard = extended => {
    history.push(constructPath({extended: extended ? 'extended' : null}));
    // dispatch(extendSelectedCard(id));
  };

  const routeLockedCard = id => {
    history.push(`${path}/${id}/locked`);
    // dispatch(extendSelectedCard(id));
  };

  const routeFlipCard = () => {
    const {params} = matchPath(url, {path});
    history.push(constructPath({flipped: !params.flipped}));
    // dispatch(flipCard(!flipped));
  };
  return {routeSelectCard, routeExtendCard, routeLockedCard, routeFlipCard};
}

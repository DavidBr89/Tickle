import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

import { GEO, TAGS, FLOORPLAN } from 'Constants/dataViews';

function updCardLoc(cardData, mapViewport) {
  const { x, y, tx, ty, vx, vy, ...restData } = cardData;

  // console.log('viewport', x, y, mapViewport);
  const vp = new PerspectiveMercatorViewport(mapViewport);

  // TODO:
  const [longitude, latitude] = vp.unproject([
    x, // || mapViewport.width / 2,
    y // || mapViewport.height / 2
  ]);
  const updatedCard = {
    ...restData,
    loc: { latitude, longitude }
  };
  return updatedCard;
}

function updCardFloorLoc(cardData, width, height) {
  return {
    ...cardData,
    floorX: cardData.x / width,
    floorY: cardData.y / height
  };
}

function updCardTags(cardData) {
  return { ...cardData };
}

export default function updCardDataDim({ rawData, viewport, dataView }) {
  const { width, height } = viewport;
  const cardData = {
    ...rawData
    // tags: rawData.tags.length === 0 ? ['no_tags'] : rawData.tags
  };

  console.log('cardData UPDATE', rawData);

  switch (dataView) {
    case GEO:
      return updCardLoc(cardData, viewport);
    case TAGS:
      return updCardTags(cardData);
    case FLOORPLAN:
      return updCardFloorLoc(cardData, width, height);
    default:
      throw Error(`could not find data dimension to update ${dataView}`);
  }
}

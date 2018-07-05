import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

function updCardLoc(cardData, mapViewport) {
  const { x, y, tx, ty, vx, vy, ...restData } = cardData;

  const vp = new PerspectiveMercatorViewport(mapViewport);

  const [longitude, latitude] = vp.unproject([x, y]);
  console.log('loc', longitude, latitude);
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

function updCardTopic(cardData) {
  return { ...cardData };
}

export function updCard({ rawData, viewport, dataView }) {
  const { width, height } = viewport;
  const cardData = {
    ...rawData
    // tags: rawData.tags.length === 0 ? ['no_tags'] : rawData.tags
  };

  switch (dataView) {
    case 'geo':
      return updCardLoc(cardData, viewport);
    case 'topic':
      return updCardTopic(cardData);
    case 'floorplan':
      return updCardFloorLoc(cardData, width, height);
    default:
      return updCardLoc(cardData, viewport);
  }
}

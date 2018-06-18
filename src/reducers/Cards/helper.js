import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';

function updCardLoc(cardData, mapViewport) {
  const { x, y, tx, ty, vx, vy, ...restData } = cardData;

  const vp = new PerspectiveMercatorViewport(mapViewport);

  const [longitude, latitude] = vp.unproject([x, y]);
  const updatedCard = {
    ...restData,
    loc: { latitude, longitude }
  };
  return updatedCard;
}

function updCardFloorLoc(cardData, width, height) {
  return {
    ...cardData,
    floorLoc: {
      relX: cardData.x / width,
      relY: cardData.y / height
    }
  };
}

function updCardTopic(cardData) {
  return { ...cardData };
}

export function updCard({ cardData, viewport, dataView }) {
  const { width, height } = viewport;
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

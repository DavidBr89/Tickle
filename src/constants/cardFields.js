export const extractCardFields = ({
  id,
  uid,
  floorX = 0.5,
  floorY = 0.5,
  img = null,
  loc: { latitude = 50.85146, longitude = 4.315483 },
  tags = [],
  media = null,
  title = null,
  challenge = null,
  description = ''
}) => ({
  id,
  uid,
  floorX,
  floorY,
  img,
  loc: { longitude, latitude },
  tags,
  media,
  title,
  challenge,
  description
});

const isDefined = a => a !== null && a !== undefined;

export const TEMP_ID = 'temp';

export const isChallengeSucceeded = c =>
  isDefined(c.challengeSubmission) &&
  c.challengeSubmission.feedback &&
  c.challengeSubmission.feedback.accomplished;

export const isChallengeSubmitted = c =>
  isDefined(c.challengeSubmission) &&
  c.challengeSubmission.completed &&
  !c.challengeSubmission.feedback;

export const isChallengeStarted = c =>
  isDefined(c.challengeSubmission) && !c.challengeSubmission.completed;

// TODO: update later
export const CARD_SEEN = 'CARD_SEEN';
export const isCardSeen = c =>
  isChallengeStarted(c) ||
  isChallengeSubmitted(c) ||
  isChallengeSucceeded(c) ||
  c.seen === true;

export const isChallengeOpen = c => !isDefined(c.challengeSubmission);

export const hasCardCreated = (c, uid) => c.uid === uid;

export const NO_CHALLENGE_FILTER = 'NO_CHALLENGE_FILTER';
export const NO_CARD_FILTER = 'NO_CARD_FILTER';
export const CHALLENGE_STARTED = 'CHALLENGE_STARTED';
export const CHALLENGE_OPEN = 'CHALLENGE_OPEN';

export const CHALLENGE_NOT_STARTED = 'CHALLENGE_NOT_STARTED';
export const CHALLENGE_SUBMITTED = 'CHALLENGE_SUBMITTED';
export const CHALLENGE_NOT_SUBMITTED = 'CHALLENGE_NOT_SUBMITTED';
export const CHALLENGE_SUCCEEDED = 'CHALLENGE_SUCCEEDED';
export const CARD_CREATED = 'CARD_CREATED';

export const challengeTypeMap = (() => {
  const obj = {};
  obj[CHALLENGE_STARTED] = isChallengeStarted;
  obj[CHALLENGE_SUBMITTED] = isChallengeSubmitted;
  obj[CHALLENGE_SUCCEEDED] = isChallengeSucceeded;
  obj[CHALLENGE_OPEN] = isChallengeOpen;
  obj[NO_CARD_FILTER] = () => true;
  obj[CARD_CREATED] = hasCardCreated;
  obj[CARD_SEEN] = isCardSeen;
  return obj;
})();

export const TITLE = 'title';
export const TAGS = 'tags';
export const DESCRIPTION = 'description';
export const MEDIA = 'media';
export const TIMERANGE = 'timerange';
export const CHALLENGE = 'challenge';
// export const TIMESTAMP = 'timestamp';

export const initCard = {
  // id,
  // uid,
  floorX: 0.5,
  floorY: 0.5,
  img: null,
  loc: {latitude: 50.85146, longitude: 4.315483},
  timerange: null, // { start: null, end: null },
  title: null,
  tags: [],
  description: null,
  media: [],
  timestamp: null,
  challenge: null,
  points: 0,
  challengeSubmission: null,
};

// TODO: where is challenge submission?
export const extractCardFields = ({...args}) => {
  const {
    floorX = initCard.floorX,
    floorY = initCard.floorY,
    img = initCard.img,
    loc = initCard.loc,
    timerange = initCard.timerange, // { start: null, end: null },
    title = initCard.title,
    tags = initCard.tags,
    description = initCard.description,
    media = initCard.media,
    timestamp = initCard.timestamp,
    challenge = initCard.challenge,
    points = initCard.points,
    challengeSubmission = initCard.challengeSubmission,
    id,
    uid,
  } = args;

  if (!Array.isArray(tags)) {
    throw new Error('tags is not an array');
  }

  if (!Array.isArray(media)) {
    throw new Error('media is not an array');
  }
  // TODO: more

  return {
    id,
    uid,
    floorX: floorX || 0.5,
    floorY: floorY || 0.5,
    img, // {url, thumbnail, title}
    loc,
    timestamp,
    timerange,
    tags,
    media,
    title,
    challenge,
    description,
    points,
    // allChallengeSubmissions,
    challengeSubmission,
  };
};

export const isFieldInitialized = ({card, attr}) => {
  const field = extractCardFields(card)[attr];
  if (Array.isArray(field)) return field.length !== 0;
  return field !== null;
};

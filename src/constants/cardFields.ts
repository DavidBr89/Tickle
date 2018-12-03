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
export const isCardSeen = (
  c = {
    challengeSubmission: {
      feedback: {accomplished: false},
      completed: false,
    },
    seen: false,
  },
) =>
  isChallengeStarted(c) ||
  isChallengeSubmitted(c) ||
  isChallengeSucceeded(c) ||
  c.seen === true;

export const isChallengeOpen = ({challengeSubmission}) =>
  !isDefined(challengeSubmission);

export const hasCardCreated = (c = {uid: '2332'}, uidTmp = '12345') =>
  c.uid === uidTmp;

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
  const obj = {
    [CHALLENGE_STARTED]: isChallengeStarted,
    [CHALLENGE_SUBMITTED]: isChallengeSubmitted,
    [CHALLENGE_SUCCEEDED]: isChallengeSucceeded,
    [CHALLENGE_OPEN]: isChallengeOpen,
    [NO_CARD_FILTER]: () => true,
    [CARD_CREATED]: hasCardCreated,
    [CARD_SEEN]: isCardSeen,
  };
  return obj;
})();

export const TITLE = 'title';
export const TAGS = 'tags';
export const DESCRIPTION = 'description';
export const MEDIA = 'media';
export const TIMERANGE = 'timerange';
export const CHALLENGE = 'challenge';
// export const TIMESTAMP = 'timestamp';

const defaultVal = () => ({key: null, value: null});

const DEFAULT_TAG = 'general';
export const fallbackTagValues = tags =>
  tags.value !== null ? tags.value : [DEFAULT_TAG];

export const initCard = {
  // id,
  // uid,
  img: {key: null, value: null},
  loc: {latitude: 50.85146, longitude: 4.315483},
  timerange: {key: null, value: null}, // { start: null, end: null },
  title: {key: null, value: null},
  tags: {key: null, value: null},
  description: {key: null, value: null},
  media: {key: null, value: null},
  timestamp: {key: null, value: null},
  challenge: {key: null, value: null},
  points: {key: null, value: null},
  challengeSubmission: null,
};

const extractValues = ({
  timerange, // { start: null, end: null },
  title,
  tags,
  description,
  media,
  // timestamp,
  challenge,
  points,
  challengeSubmission,
}) => ({
  timerange: timerange.value,
  title: title.value,
  tags: tags.value,
  description: description.value,
  media: media.value,
  challenge: challenge.value,
  points: points.value,
  challengeSubmission: challengeSubmission.value,
});

// TODO: where is challenge submission?
export const extractCardFields = ({
  id = 'string',
  uid = 'string',
  loc = {latitude: 50.85146, longitude: 4.315483},
  img = defaultVal(),
  timerange = defaultVal(), // { start: null, end: null },
  title = defaultVal(),
  tags = defaultVal(),
  description = defaultVal(),
  media = defaultVal(),
  timestamp = defaultVal(),
  challenge = defaultVal(),
  points = defaultVal(),
  challengeSubmission = null,
}) =>
  // if (!Array.isArray(tags)) {
  //   throw new Error('tags is not an array');
  // }
  //
  // if (!Array.isArray(media)) {
  //   throw new Error('media is not an array');
  // }
  // TODO: more

  ({
    id,
    uid,
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
  });

export const isFieldInitialized = ({card, attr}) => {
  const field = extractCardFields(card)[attr];
  console.log('attr', attr, field);
  return field.value !== null;
};

export const getNumInitFields = card => {
  const isInit = attr => isFieldInitialized({card, attr});

  return [
    isInit('title'),
    isInit('tags'),
    isInit('media'),
    isInit('description'),
  ].filter(d => d).length;
};

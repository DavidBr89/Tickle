const isDefined = a => a !== null && a !== undefined;

export const TEMP_ID = 'temp';

export const isActivitySucceeded = c =>
  isDefined(c.activitySubmission) &&
  c.activitySubmission.feedback &&
  c.activitySubmission.feedback.accomplished;

export const isActivityStarted = c =>
  isDefined(c.activitySubmission) &&
  c.activitySubmission.completed &&
  !c.activitySubmission.feedback;

// TODO: update later
export const CARD_SEEN = 'CARD_SEEN';
export const isCardSeen = (
  c = {
    activitySubmission: {
      feedback: {accomplished: false},
      completed: false,
    },
    seen: false,
  },
) =>
  isActivityStarted(c) ||
  isActivityStarted(c) ||
  isActivitySucceeded(c) ||
  c.seen === true;

export const isChallengeOpen = ({activitySubmission}) =>
  !isDefined(activitySubmission);

export const hasCardCreated = (c = {uid: '2332'}, uidTmp = '12345') =>
  c.uid === uidTmp;

export const NO_ACTIVITY_FILTER = 'NO_ACTIVITY_FILTER';
export const ACTIVITY_STARTED = 'ACTIVITY_STARTED';
export const ACTIVITY_OPEN = 'ACTIVITY_OPEN';

export const ACTIVITY_NOT_STARTED = 'ACTIVITY_NOT_STARTED';
export const ACTIVITY_SUBMITTED = 'ACTIVITY_SUBMITTED';
export const CHALLENGE_NOT_SUBMITTED = 'CHALLENGE_NOT_SUBMITTED';
export const ACTIVITY_SUCCEEDED = 'ACTIVITY_SUCCEEDED';
export const CARD_CREATED = 'CARD_CREATED';

export const activityFilterMap = (() => {
  const obj = {
    [ACTIVITY_STARTED]: isActivityStarted,
    [ACTIVITY_SUBMITTED]: isActivityStarted,
    [ACTIVITY_SUCCEEDED]: isActivitySucceeded,
    [ACTIVITY_OPEN]: isChallengeOpen,
    [NO_ACTIVITY_FILTER]: () => true,
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
export const ACTIVITY = 'activity';
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
  activity: {key: null, value: null},
  points: {key: null, value: null},
  activitySubmission: null,
};

const extractValues = ({
  timerange, // { start: null, end: null },
  title,
  tags,
  description,
  media,
  // timestamp,
  activity,
  points,
  activitySubmission,
}) => ({
  timerange: timerange.value,
  title: title.value,
  tags: tags.value,
  description: description.value,
  media: media.value,
  activity: activity.value,
  points: points.value,
  activitySubmission: activitySubmission.value,
});

// TODO: where is activity submission?
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
  activity = defaultVal(),
  points = defaultVal(),
  activitySubmission = null,
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
    activity,
    description,
    points,
    // allChallengeSubmissions,
    activitySubmission,
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

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
      completed: false
    },
    seen: false
  }
) =>
  isActivityStarted(c) ||
  isActivityStarted(c) ||
  isActivitySucceeded(c) ||
  c.seen === true;

export const isActivityOpen = ({activitySubmission}) =>
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

const DATE = 'date';
const POINTS = 'points';

export const activityFilterMap = (() => {
  const obj = {
    [ACTIVITY_STARTED]: isActivityStarted,
    [ACTIVITY_SUBMITTED]: isActivityStarted,
    [ACTIVITY_SUCCEEDED]: isActivitySucceeded,
    [ACTIVITY_OPEN]: isActivityOpen,
    [NO_ACTIVITY_FILTER]: () => true,
    [CARD_CREATED]: hasCardCreated,
    [CARD_SEEN]: isCardSeen
  };
  return obj;
})();

export const TITLE = 'title';
export const TAGS = 'tags';
export const DESCRIPTION = 'description';
export const MEDIA = 'media';
export const TIMERANGE = 'timerange';
export const ACTIVITY = 'activity';
export const IMG = 'img';
export const VIDEOS = 'videos';
export const TIMESTAMP = 'timestamp';

const DEFAULT_TAG = 'general';
export const fallbackTagValues = tags =>
  tags.value !== null ? tags.value : [DEFAULT_TAG];

// const extractValues = ({
//   timerange, // { start: null, end: null },
//   title,
//   tags,
//   description,
//   media,
//   // timestamp,
//   activity,
//   points,
//   activitySubmission,
// }) => ({
//   timerange: timerange.value,
//   title: title.value,
//   tags: tags.value,
//   description: description.value,
//   media: media.value,
//   activity: activity.value,
//   points: points.value,
//   activitySubmission: activitySubmission.value,
// });

// TODO: where is activity submission?
const defaultObjVal = () => ({label: null, value: null});

export const extractCardFields = obj => {
  const {
    id = 'string',
    uid = 'string',
    loc = {latitude: 50.85146, longitude: 4.315483},
    img = defaultObjVal(IMG),
    timerange = {...defaultObjVal(), thumbnail: null}, // { start: null, end: null },
    title = defaultObjVal(TITLE),
    tags = defaultObjVal(TAGS),
    description = defaultObjVal(DESCRIPTION),
    videos = defaultObjVal(VIDEOS),
    date = defaultObjVal(DATE),
    activity = defaultObjVal(ACTIVITY),
    points = defaultObjVal(POINTS),
    activitySubmission = null
  } = obj;

  return {
    id,
    uid,
    img, // {url, thumbnail, title}
    loc,
    date,
    timerange,
    tags,
    videos,
    title,
    activity,
    description,
    points,
    // allChallengeSubmissions,
    activitySubmission
  };
};

export const initCardFields = extractCardFields({});

export const isFieldInitialized = ({card, attr}) => {
  const field = extractCardFields(card)[attr];
  return field.value !== null;
};

export const getNumInitFields = card => {
  const isInit = attr => isFieldInitialized({card, attr});

  return [
    isInit('title'),
    isInit('tags'),
    isInit('media'),
    isInit('description')
  ].filter(d => d).length;
};

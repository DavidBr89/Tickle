const isDefined = a => a !== null && a !== undefined;

export const isChallengeSucceeded = c =>
  isDefined(c.challengeSubmission) && c.challengeSubmission.accomplished;

export const isChallengeSubmitted = c =>
  isDefined(c.challengeSubmission) && c.challengeSubmission.completed;

export const isChallengeStarted = c =>
  isDefined(c.challengeSubmission) && !c.challengeSubmission.completed;

export const NO_CHALLENGE_FILTER = 'NO_CHALLENGE_FILTER';
export const CHALLENGE_STARTED = 'CHALLENGE_STARTED';

export const CHALLENGE_NOT_STARTED = 'CHALLENGE_NOT_STARTED';
export const CHALLENGE_SUBMITTED = 'CHALLENGE_SUBMITTED';
export const CHALLENGE_NOT_SUBMITTED = 'CHALLENGE_NOT_SUBMITTED';
export const CHALLENGE_SUCCEEDED = 'CHALLENGE_SUCCEEDED';

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
  floorX: floorX || 0.5,
  floorY: floorY || 0.5,
  img,
  loc: { longitude, latitude },
  tags,
  media,
  title,
  challenge,
  description
});

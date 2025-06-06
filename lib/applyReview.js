const { getCardId } = require('./types');
const dateDiffInDays = require('./dateDiffInDays');
const { calculateDueDate } = require('./computeCardsSchedule');

// -- applyToLearningCardState(...)

// constants from Anki defaults
// TODO(April 1, 2017) investigate rationales, consider changing them
const INITIAL_FACTOR = 2500;
const INITIAL_DAYS_WITHOUT_JUMP = 4;
const INITIAL_DAYS_WITH_JUMP = 1;

function applyToLearningCardState(prev, ts, rating) {
  if (rating === 'easy' || (rating === 'good' && prev.consecutiveCorrect > 0)) {
    return {
      master: prev.master,
      combination: prev.combination,

      mode: 'reviewing',
      factor: INITIAL_FACTOR,
      lapses: 0,
      interval: prev.consecutiveCorrect > 0 ? INITIAL_DAYS_WITHOUT_JUMP : INITIAL_DAYS_WITH_JUMP,
      lastReviewed: ts,
    };
  } else if (rating === 'again') {
    return {
      master: prev.master,
      combination: prev.combination,

      mode: 'learning',
      consecutiveCorrect: 0,
      lastReviewed: ts,
    };
  } else if (rating === 'hard' || (rating === 'good' && prev.consecutiveCorrect < 1)) {
    return {
      master: prev.master,
      combination: prev.combination,

      mode: 'learning',
      consecutiveCorrect: prev.consecutiveCorrect + 1,
      lastReviewed: ts,
    };
  }
  throw new Error('logic error');
}


// -- applyToReviewingCardState(...)

const EASY_BONUS = 2;
const MAX_INTERVAL = 365;
const MIN_FACTOR = 0; // TODO
const MAX_FACTOR = Number.MAX_VALUE;
function constrainWithin(min, max, n) {
  if (min > max) {
    throw new Error(`min > max: ${min}=min, ${max}=max`);
  }
  return Math.max(Math.min(n, max), min);
}

function calculateDaysLate(state, actual) {
  const expected = calculateDueDate(state);

  const daysLate = dateDiffInDays(actual, expected);

  if (daysLate < 0) {
    // console.log('error: last review occured earlier than expected');
    return 0;
  }

  return daysLate;
}
function applyToReviewingCardState(prev, ts, rating) {
  if (rating === 'again') {
    return {
      master: prev.master,
      combination: prev.combination,

      mode: 'lapsed',
      consecutiveCorrect: 0,
      factor: constrainWithin(MIN_FACTOR, MAX_FACTOR, prev.factor - 200),
      lapses: prev.lapses + 1,
      interval: prev.interval,
      lastReviewed: ts,
    };
  }
  const factorAdj = (
    rating === 'hard' ? -150 :
    rating === 'good' ? 0 :
    rating === 'easy' ? 150 :
    NaN
  );
  const daysLate = calculateDaysLate(prev, ts);

  const ival = constrainWithin(prev.interval + 1, MAX_INTERVAL,
    rating === 'hard' ? (prev.interval + (daysLate / 4)) * 1.2 :
    rating === 'good' ? ((prev.interval + (daysLate / 2)) * prev.factor) / 1000 :
    rating === 'easy' ? (((prev.interval + daysLate) * prev.factor) / 1000) * EASY_BONUS :
    NaN,
  );

  if (isNaN(factorAdj) || isNaN(ival)) {
    throw new Error(`invalid rating: ${rating}`);
  }

  return {
    master: prev.master,
    combination: prev.combination,

    mode: 'reviewing',
    factor: constrainWithin(MIN_FACTOR, MAX_FACTOR, prev.factor + factorAdj),
    lapses: prev.lapses,
    interval: ival,
    lastReviewed: ts,
  };
}

// -- applyToLapsedCardState(...)

function applyToLapsedCardState(prev, ts, rating) {
  if (rating === 'easy' || (rating.match(/^easy|good$/) && prev.consecutiveCorrect > 0)) {
    return {
      master: prev.master,
      combination: prev.combination,

      mode: 'reviewing',
      factor: prev.factor,
      lapses: prev.lapses,
      interval: prev.consecutiveCorrect > 0 ? INITIAL_DAYS_WITHOUT_JUMP : INITIAL_DAYS_WITH_JUMP,
      lastReviewed: ts,
    };
  }
  return {
    master: prev.master,
    combination: prev.combination,

    mode: 'lapsed',
    factor: prev.factor,
    lapses: prev.lapses,
    interval: prev.interval,
    lastReviewed: ts,
    consecutiveCorrect: rating === 'again' ? 0 : prev.consecutiveCorrect + 1,
  };
}

// -- applyReview(...)

function applyToCardState(prev, ts, rating) {
  if (prev.lastReviewed != null && prev.lastReviewed > ts) {
    const p = prev.lastReviewed.toISOString();
    const t = ts.toISOString();
    throw new Error(`cannot apply review before current lastReviewed: ${p} > ${t}`);
  }

  if (prev.mode === 'learning') {
    return applyToLearningCardState(prev, ts, rating);
  } else if (prev.mode === 'reviewing') {
    return applyToReviewingCardState(prev, ts, rating);
  } else if (prev.mode === 'lapsed') {
    return applyToLapsedCardState(prev, ts, rating);
  }
  throw new Error(`invalid mode: ${prev.mode}`);
}

function applyReview(prev, review) {
  const cardId = getCardId(review);

  const cardState = prev.cardStates[cardId];
  if (cardState == null) {
    throw new Error(`applying review to missing card: ${JSON.stringify(review)}`);
  }

  const state = {
    cardStates: { ...prev.cardStates },
  };
  state.cardStates[cardId] = applyToCardState(cardState, review.ts, review.rating);

  return state;
}

module.exports = {
  applyToCardState,
  applyReview,
};
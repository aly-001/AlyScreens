const uuid = require('uuid');

function generateId() {
  return uuid.v4();
}

function getCardId(o) {
  return `${o.master}#${o.combination.front.join(',')}@${o.combination.back.join(',')}`;
}

function makeInitialCardState(master, combination) {
  return {
    master,
    combination,
    mode: 'learning',
    consecutiveCorrect: 0,
    lastReviewed: null,
  };
}

function makeEmptyState() {
  return {
    cardStates: {},
  };
}

function cmpSchedule(a, b) {
  const scheduleVals = {
    later: 0,
    due: 1,
    overdue: 2,
    learning: 3,
  };
  const diff = scheduleVals[b] - scheduleVals[a];
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  }
  return 0;
}

module.exports = {
  generateId,
  getCardId,
  makeInitialCardState,
  makeEmptyState,
  cmpSchedule,
};
const {
  makeEmptyState,
  getCardId,
  makeInitialCardState,
  generateId,
} = require('./types');
const addReview = require('./addReview');
const { applyReview } = require('./applyReview');
const { computeCardsSchedule } = require('./computeCardsSchedule');
const { pickMostDue } = require('./computeCardsSchedule');

class DolphinSR {
  constructor(currentDateGetter = () => new Date()) {
    this._state = makeEmptyState();
    this._masters = {};
    this._reviews = [];
    this._currentDateGetter = currentDateGetter;
    this.MATURITY_THRESHOLD = 20; // 20 days threshold for maturity
  }

  _addMaster(master) {
    if (this._masters[master.id]) {
      throw new Error(`master already added: ${master.id}`);
    }
    master.combinations.forEach((combination) => {
      const id = getCardId({ master: master.id, combination });
      this._state.cardStates[id] = makeInitialCardState(master.id, combination);
    });
    this._masters[master.id] = master;
  }

  addMasters(...masters) {
    masters.forEach(master => this._addMaster(master));
    this._cachedCardsSchedule = null;
  }

  _addReviewToReviews(review) {
    this._reviews = addReview(this._reviews, review);
    const lastReview = this._reviews[this._reviews.length - 1];

    return (
      `${getCardId(lastReview)}#${lastReview.ts.toISOString()}` !==
      `${getCardId(review)}#${review.ts.toISOString()}`
    );
  }

  addReviews(...reviews) {
    const needsRebuild = reviews.reduce((v, review) => {
      if (this._addReviewToReviews(review)) {
        return true;
      }
      return v;
    }, false);

    if (needsRebuild) {
      this._rebuild();
    } else {
      reviews.forEach((review) => {
        this._state = applyReview(this._state, review);
      });
    }

    this._cachedCardsSchedule = null;

    return needsRebuild;
  }

  _rebuild() {
    console.log("rebuilding state");
    const masters = this._masters;
    const reviews = this._reviews;
    this._masters = {};
    this._reviews = [];

    this.addMasters(...Object.keys(masters).map(k => masters[k]));
    this.addReviews(...reviews);
  }

  _getCardsSchedule() {
    if (this._cachedCardsSchedule != null) {
      return this._cachedCardsSchedule;
    }
    this._cachedCardsSchedule = computeCardsSchedule(this._state, this._currentDateGetter());
    return this._cachedCardsSchedule;
  }

  _nextCardId() {
    const s = this._getCardsSchedule();
    return pickMostDue(s, this._state);
  }

  _getCard(id) {
    const [masterId, combo] = id.split('#');
    const [front, back] = combo.split('@').map(part => part.split(',').map(x => parseInt(x, 10)));
    const master = this._masters[masterId];
    if (master == null) {
      throw new Error(`cannot getCard: no such master: ${masterId}`);
    }
    const combination = { front, back };

    const frontFields = front.map(i => master.fields[i]);
    const backFields = back.map(i => master.fields[i]);

    return {
      master: masterId,
      combination,
      front: frontFields,
      back: backFields,
    };
  }

  nextCard() {
    const cardId = this._nextCardId();
    if (cardId == null) {
      return null;
    }
    return this._getCard(cardId);
  }

  summary() {
    const s = this._getCardsSchedule();
    const newCount = this.getNewCards().length;
    const matureCount = this.getMature().length;

    return {
      new: newCount,
      due: s.due.length,
      later: s.later.length,
      learning: s.learning.length - newCount,
      overdue: s.overdue.length,
      mature: matureCount,
      duePlusOverdue: s.due.length + s.overdue.length,
    };
  }

  getCardsWithIntervalRange(minInterval, maxInterval) {
    const cards = [];
    Object.keys(this._state.cardStates).forEach((cardId) => {
      const cardState = this._state.cardStates[cardId];
      if (
        cardState.interval >= minInterval &&
        cardState.interval <= maxInterval
      ) {
        cards.push(this._getCard(cardId));
      }
    });
    return cards;
  }

  getNewCards() {
    const newCards = [];
    Object.keys(this._state.cardStates).forEach((cardId) => {
      const cardState = this._state.cardStates[cardId];
      if (cardState.lastReviewed == null) {
        newCards.push(this._getCard(cardId));
      }
    });
    return newCards;
  }

  getLearningCards() {
    const s = this._getCardsSchedule();
    const newCardIds = new Set(this.getNewCards().map(card => getCardId(card)));
    return s.learning
      .filter(cardId => !newCardIds.has(cardId))
      .map(cardId => this._getCard(cardId));
  }

  getLaterCards() {
    const s = this._getCardsSchedule();
    return s.later.map(cardId => this._getCard(cardId));
  }

  getDueCards() {
    const s = this._getCardsSchedule();
    return s.due.map(cardId => this._getCard(cardId));
  }

  getOverdueCards() {
    const s = this._getCardsSchedule();
    return s.overdue.map(cardId => this._getCard(cardId));
  }

  getDuePlusOverdueCards() {
    const s = this._getCardsSchedule();
    return s.due.concat(s.overdue).map(cardId => this._getCard(cardId));
  }
  
  getMature() {
    const matureCards = [];
    Object.keys(this._state.cardStates).forEach((cardId) => {
      const cardState = this._state.cardStates[cardId];
      if (cardState.interval >= 21) {
        matureCards.push(this._getCard(cardId));
      }
    });
    return matureCards;
  }

  getYoung() {
    const youngCards = [];
    const newCards = this.getNewCards();
    // if not a new card and interval is below 21
    Object.keys(this._state.cardStates).forEach((cardId) => {
      if (!newCards.includes(this._getCard(cardId)) && this._state.cardStates[cardId].interval < 21) {
        youngCards.push(this._getCard(cardId));
      }
    });
    return youngCards;
  }


  getAllIntervals() {
    const intervals = {};
    Object.keys(this._state.cardStates).forEach((cardId) => {
      intervals[cardId] = this._state.cardStates[cardId].interval;
    });
    return intervals;
  }

  getAll() {
    return Object.keys(this._state.cardStates).map(cardId => this._getCard(cardId));
  }

}

module.exports = {
  DolphinSR,
  generateId,
};
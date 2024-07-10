
// This function only works if reviews is always sorted by timestamp
function addReview(reviews , review )  {
  if (!reviews.length) {
    return [review];
  }

  let i = reviews.length - 1;
  for (; i >= 0; i -= 1) {
    if (reviews[i].ts <= review.ts) {
      break;
    }
  }

  const newReviews = reviews.slice(0);
  newReviews.splice(i + 1, 0, review);

  return newReviews;
}
// module exports...
module.exports = addReview;
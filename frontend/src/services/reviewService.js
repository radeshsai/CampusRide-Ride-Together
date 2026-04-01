import api from './api'

export const getUserReviews = (userId) => api.get(`/reviews/user/${userId}`)
export const createReview = (rideId, reviewedUserId, rating, comment) =>
  api.post(`/reviews/ride/${rideId}/user/${reviewedUserId}`, null, {
    params: { rating, comment }
  })

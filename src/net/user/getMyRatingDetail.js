import get from '../core/get';
import { API_HOST } from '@env';

const getMyRatingDetail = (page, value) => {
  return get(`${API_HOST}/v1/me/ratings`, {
    params: {
      page,
      value,
    },
  });
};

export default getMyRatingDetail;

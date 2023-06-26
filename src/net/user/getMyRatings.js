import get from '../core/get';
import { API_HOST } from '@env';

const getMyRatings = () => {
  return get(`${API_HOST}/v1/me/ratings/all`);
};

export default getMyRatings;

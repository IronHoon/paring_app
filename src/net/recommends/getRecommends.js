import get from '../core/get';
import { API_HOST } from '@env';

const getRecommends = () => {
  return get(`${API_HOST}/v1/recommends`);
};

export default getRecommends;

import get from '../core/get';
import { API_HOST } from '@env';

const getBottoms = () => {
  return get(`${API_HOST}/v1/bottoms`);
};

export default getBottoms;

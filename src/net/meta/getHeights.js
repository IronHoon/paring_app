import get from '../core/get';
import { API_HOST } from '@env';

const getHeights = () => {
  return get(`${API_HOST}/v1/heights`);
};

export default getHeights;

import get from '../core/get';
import { API_HOST } from '@env';

const getTops = () => {
  return get(`${API_HOST}/v1/tops`);
};

export default getTops;

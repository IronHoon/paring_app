import get from '../core/get';
import { API_HOST } from '@env';

const getOuters = () => {
  return get(`${API_HOST}/v1/outers`);
};

export default getOuters;

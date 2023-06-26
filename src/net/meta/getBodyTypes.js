import get from '../core/get';
import { API_HOST } from '@env';

const getBodyTypes = () => {
  return get(`${API_HOST}/v1/body-types`);
};

export default getBodyTypes;

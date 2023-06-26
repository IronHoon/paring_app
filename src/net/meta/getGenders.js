import get from '../core/get';
import { API_HOST } from '@env';

const getGenders = () => {
  return get(`${API_HOST}/v1/genders`);
};

export default getGenders;

import get from '../core/get';
import { API_HOST } from '@env';

const getStyles = () => {
  return get(`${API_HOST}/v1/styles`);
};

export default getStyles;

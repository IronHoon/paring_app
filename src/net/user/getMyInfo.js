import get from '../core/get';
import { API_HOST } from '@env';

const getMyInfo = () => {
  return get(`${API_HOST}/v1/me`);
};

export default getMyInfo;

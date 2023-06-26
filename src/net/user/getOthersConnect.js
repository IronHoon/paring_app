import get from '../core/get';
import { API_HOST } from '@env';

const getOthersConnect = (userId) => {
  return get(`${API_HOST}/v1/users/${userId}/connect`);
};

export default getOthersConnect;

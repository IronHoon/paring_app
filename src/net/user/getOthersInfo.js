import get from '../core/get';
import { API_HOST } from '@env';

const getOthersInfo = (userId) => {
  return get(`${API_HOST}/v1/users/${userId}`);
};

export default getOthersInfo;

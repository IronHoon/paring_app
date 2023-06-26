import { API_HOST } from '@env';
import get from '../core/get';

const getFollowStatus = (userId) => {
  return get(`${API_HOST}/v1/users/${userId}/follow`);
};

export default getFollowStatus;

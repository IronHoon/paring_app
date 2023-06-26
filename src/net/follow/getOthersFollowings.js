import { API_HOST } from '@env';
import get from '../core/get';

const getOthersFollowings = (userId, page) => {
  return get(`${API_HOST}/v1/users/${userId}/followings`, {
    params: {
      page,
    },
  });
};

export default getOthersFollowings;

import { API_HOST } from '@env';
import get from '../core/get';

const getOthersFollowers = (userId, page) => {
  return get(`${API_HOST}/v1/users/${userId}/followers`, {
    params: {
      page,
    },
  });
};

export default getOthersFollowers;

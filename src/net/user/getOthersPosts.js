import get from '../core/get';
import { API_HOST } from '@env';

const getOthersPosts = (userId, page, type) => {
  return get(`${API_HOST}/v1/users/${userId}/posts`, {
    params: {
      page: page,
      type: type,
    },
  });
};

export default getOthersPosts;

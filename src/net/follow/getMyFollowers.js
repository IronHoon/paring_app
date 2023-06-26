import { API_HOST } from '@env';
import get from '../core/get';

const getMyFollowers = (page) => {
  return get(`${API_HOST}/v1/me/followers`, {
    params: {
      page,
    },
  });
};

export default getMyFollowers;

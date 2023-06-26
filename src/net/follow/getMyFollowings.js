import { API_HOST } from '@env';
import get from '../core/get';

const getMyFollowings = (page) => {
  return get(`${API_HOST}/v1/me/followings`, {
    params: {
      page,
    },
  });
};

export default getMyFollowings;

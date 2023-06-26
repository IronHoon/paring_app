import get from '../core/get';
import { API_HOST } from '@env';

const getPosts = (page, type, params = {}) => {
  return get(`${API_HOST}/v1/posts`, {
    params: {
      page: page || 1,
      type: type || '',
      ...params,
    },
  });
};

export default getPosts;

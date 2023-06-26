import { API_HOST } from '@env';
import get from '../core/get';

const getLike = (postId) => {
  return get(`${API_HOST}/v1/likes`, {
    params: {
      post_id: postId,
    },
  });
};

export default getLike;

import { API_HOST } from '@env';
import patch from '../core/patch';

const patchLike = (postId) => {
  return patch(`${API_HOST}/v1/likes`, {
    post_id: postId,
  });
};

export default patchLike;

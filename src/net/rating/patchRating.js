import { API_HOST } from '@env';
import patch from '../core/patch';

const patchRating = (postId, value) => {
  return patch(`${API_HOST}/v1/posts/${postId}/rating`, {
    value,
  });
};

export default patchRating;

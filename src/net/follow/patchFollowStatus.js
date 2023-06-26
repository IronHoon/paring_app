import { API_HOST } from '@env';
import patch from '../core/patch';

const patchFollowStatus = (userId) => {
  return patch(`${API_HOST}/v1/users/${userId}/follow`);
};

export default patchFollowStatus;

import { API_HOST } from '@env';
import post from '../core/post';

const findPassword = (email) => {
  return post(`${API_HOST}/v1/reset-password`, {
    email,
  });
};

export default findPassword;

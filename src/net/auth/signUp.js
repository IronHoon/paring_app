import post from '../core/post';
import { API_HOST } from '@env';

const signUp = (formData) => {
  return post(`${API_HOST}/v1/sign-up`, formData);
};

export default signUp;

import post from '../core/post';
import { API_HOST } from '@env';

const postOrder = (body) => {
  return post(`${API_HOST}/v1/orders`, body);
};

export default postOrder;

import { API_HOST } from '@env';
import get from '../core/get';

const getOrders = (page = 1) => {
  return get(`${API_HOST}/v1/orders`, { params: { page } });
};

export default getOrders;

import { API_HOST } from '@env';
import get from '../core/get';

const getProduct = (product_id) => {
  return get(`${API_HOST}/v1/products/${product_id}`);
};

export default getProduct;

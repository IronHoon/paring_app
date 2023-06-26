import { API_HOST } from '@env';
import get from '../core/get';

const getProductOptions = (product_id) => {
  return get(`${API_HOST}/v1/products/${product_id}/options`);
};

export default getProductOptions;

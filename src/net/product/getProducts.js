import { API_HOST } from '@env';
import get from '../core/get';

const getProducts = (category_key, category_id, page = 1, disableShuffle, poster_id) => {
  let category = {};
  switch (category_key) {
    case 'top':
      category = { top_id: category_id };
      break;
    case 'bottom':
      category = { bottom_id: category_id };
      break;
    case 'style':
      category = { style_id: category_id };
      break;
    case 'outer':
      category = { outer_id: category_id };
      break;
    case null:
      break;
    default:
      console.warn('category_key is not valid');
      break;
  }
  return get(`${API_HOST}/v1/products`, {
    params: {
      page,
      ...category,
      shuffled: disableShuffle ? 'no' : 'yes',
      poster_id: poster_id ?? 0,
    },
  });
};

export default getProducts;

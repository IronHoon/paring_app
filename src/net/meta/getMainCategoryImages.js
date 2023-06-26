import get from '../core/get';
import { API_HOST } from '@env';

const getMainCategoryImages = (category_id) => {
  return get(`${API_HOST}/v1/meta-data/main-category-images`, {
    params: {
      id: category_id,
    },
  });
};

export default getMainCategoryImages;

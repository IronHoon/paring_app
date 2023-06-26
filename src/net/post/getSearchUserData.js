import get from '../core/get';
import { API_HOST } from '@env';

const getSearchUserData = (page, type, params = {}, searchText) => {
  return get(`${API_HOST}/v1/search/users?query=${searchText}`, {
    params: {
      page: page || 1,
      ...params,
    },
  });
};

export default getSearchUserData;

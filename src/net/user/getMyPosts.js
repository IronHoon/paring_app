import get from '../core/get';
import { API_HOST } from '@env';

const getMyPosts = (page, type, args: {}) => {
  return get(`${API_HOST}/v1/me/posts`, {
    params: {
      page: page,
      type: type,
      order: args?.order || '',
      startDate: args?.startDate || '',
      endDate: args?.endDate || '',
      style_id: args?.style_id || '',
      top_id: args?.top_id || '',
      bottom_id: args?.bottom_id || '',
      outer_id: args?.outer_id || '',
      gender_id: args?.gender_id || '',
      body_type_id: args?.body_type_id || '',
      height_id: args?.height_id || '',
    },
  });
};

export default getMyPosts;

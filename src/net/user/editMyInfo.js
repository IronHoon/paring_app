import patch from '../core/patch';
import { API_HOST } from '@env';

const editMyInfo = (params) => {
  return patch(`${API_HOST}/v1/me`, params);
};

export default editMyInfo;

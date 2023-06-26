import del from '../core/del';
import { API_HOST } from '@env';

const deleteMyInfo = () => {
  return del(`${API_HOST}/v1/me`);
};

export default deleteMyInfo;

import patch from '../core/patch';
import { API_HOST } from '@env';

const editPassword = (current_password, new_password, password_confirmation) => {
  return patch(`${API_HOST}/v1/me/password`, {
    current_password,
    new_password,
    password_confirmation,
  });
};

export default editPassword;

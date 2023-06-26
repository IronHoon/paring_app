import { useAuth } from '../../hooks';

const errorHandler = (reject, callback) => {
  const auth = useAuth();

  return async (error) => {
    const message = error.response?.data?.header?.message || error.response?.data?.message || error.message;
    const status = error.response?.status;

    if (callback) {
      callback(error);
    } else {
      try {
        if (message === '탈퇴한 사용자입니다') {
          await auth.logout();
        }
      } catch (error) {}
    }
    reject(error);
  };
};

export default errorHandler;

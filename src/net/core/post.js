import axios from 'axios';
import resolveHandler from './resolveHandleer';
import errorHandler from './errorHandler';

const post = (url, params, config, errorCallback) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params, config).then(resolveHandler(resolve)).catch(errorHandler(reject, errorCallback));
  });
};

export default post;

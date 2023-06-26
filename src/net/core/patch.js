import axios from 'axios';
import resolveHandler from './resolveHandleer';
import errorHandler from './errorHandler';

const patch = (url, params, config, errorCallback) => {
  return new Promise((resolve, reject) => {
    axios.patch(url, params, config).then(resolveHandler(resolve)).catch(errorHandler(reject, errorCallback));
  });
};

export default patch;

import axios from 'axios';
import resolveHandler from './resolveHandleer';
import errorHandler from './errorHandler';

const get = (url, config, errorCallback) => {
  return new Promise((resolve, reject) => {
    axios.get(url, config).then(resolveHandler(resolve)).catch(errorHandler(reject, errorCallback));
  });
};

export default get;

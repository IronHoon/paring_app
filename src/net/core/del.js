import axios from 'axios';
import resolveHandler from './resolveHandleer';
import errorHandler from './errorHandler';

const del = (url, config, errorCallback) => {
  return new Promise((resolve, reject) => {
    axios.delete(url, config).then(resolveHandler(resolve)).catch(errorHandler(reject, errorCallback));
  });
};

export default del;

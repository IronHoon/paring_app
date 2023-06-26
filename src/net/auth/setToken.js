import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '@env';

const setToken = (token) => {
  try {
    axios.defaults.headers.common['Authorization'] = 'bearer ' + token;
    AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.warn(error);
  }
};

export default setToken;

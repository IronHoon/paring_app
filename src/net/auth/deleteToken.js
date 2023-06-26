import axios from 'axios';
import { TOKEN_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFirebase } from '../../utils/useFirebase';

const deleteToken = async (token) => {
  try {
    axios.defaults.headers.common['Authorization'] = null;
    AsyncStorage.removeItem(TOKEN_KEY);

    // 고유 device가 가지고 있는 토큰이므로 계정간에 token차이는 없기에 remove하는 것이 무의미함
    // 또한 removeToken을 함으로써 로그아웃을 했을때 firebase간의 연결(구독?)이 끊기는 것이 아닐지 의심됨.
    await useFirebase().removeToken();
  } catch (error) {
    console.warn(error);
  }
};

export default deleteToken;

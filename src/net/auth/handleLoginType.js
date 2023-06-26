import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLoginType = async (mode = 'set', loginType = '') => {
  // login_type : 'email', 'kakao', 'apple'
  try {
    if (mode === 'set') {
      return await AsyncStorage.setItem('login_type', loginType);
    }
    if (mode === 'remove') {
      return await AsyncStorage.removeItem('login_type');
    }
    if (mode === 'get') {
      return await AsyncStorage.getItem('login_type');
    }
  } catch (error) {
    console.warn(error);
  }
};

export default handleLoginType;

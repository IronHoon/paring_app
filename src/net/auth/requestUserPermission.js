import { Alert } from 'react-native';

import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
import { useFirebase } from '../../utils/useFirebase';

const checkPermission = async () => {
  const enabled = await useFirebase().getPermissionStatus();
  if (enabled) {
    // user has permissions
    Alert.alert('알림 허용', '알림 메시지가 허용되었습니다.');
  } else {
    // user doesn't have permission
    requestPermission();
  }
};

const requestPermission = async () => {
  try {
    // User has authorised
    await useFirebase().requestPermission();
    Alert.alert('알림 허용', '알림 메시지가 허용되었습니다.');
  } catch (error) {
    // User has rejected permissions
    alert("you can't handle push notification");
    console.warn('requestPermission', error);
  }
};

export const checkUserPermission = async (handleModal) => {
  const { status, setting } = await checkNotifications();
  switch (status) {
    case RESULTS.UNAVAILABLE:
      console.info('This feature is not available (on this device / in this context)');
      break;
    case RESULTS.DENIED:
      console.info('The permission has not been requested / is denied but requestable');
      handleModal(true);
      break;
    case RESULTS.LIMITED:
      console.info('The permission is limited: some actions are possible');
      break;
    case RESULTS.GRANTED:
      console.info('The permission is granted');
      break;
    case RESULTS.BLOCKED:
      console.info('The permission is denied and not requestable anymore');
      break;
  }
};

export const requestUserPermission = async () => {
  const { settings, status } = await requestNotifications(['alert', 'sound']);
  try {
    if (status === 'granted') {
      await checkPermission();
    } else {
      Alert.alert(
        '알림 거부',
        '알림 메시지가 거부되었습니다. 알림 받기를 원하시면 기기 환경설정에서 이 앱의 알림 설정을 허용으로 변경해주세요.',
      );
    }
  } catch (error) {
    console.warn(error.response);
  }
};

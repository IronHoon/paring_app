import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { showMessage } from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
import messaging, { firebase } from '@react-native-firebase/messaging';

import registerFCMToken from '../net/auth/registerFCMToken';
import { getCurrentRoute, navigate } from '../navigators/RootNavigation';

export const useFirebase = () => {
  const getAppleUserCredential = async (identityToken, nonce) => {
    const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
    return await firebase.auth().signInWithCredential(appleCredential);
  };

  const getPermissionStatus = async () => {
    return await firebase.messaging().hasPermission();
  };

  const requestPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.info('User has notification permissions enabled.');
    } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      console.info('User has provisional notification permissions.');
    } else {
      console.info('User has notification permissions disabled');
    }
  };

  const removeToken = async () => {
    try {
      auth().onAuthStateChanged((user) => {
        const authorizedEntity = firebase.app().options.messagingSenderId;
        firebase.messaging().deleteToken(authorizedEntity, '*');
      });
    } catch (e) {
      console.warn('removeToken', e);
    }
  };

  const subscribeInAppNotification = () => {
    return messaging().onMessage(async (remoteMessage) => {
      const response = remoteMessage?.notification || {};
      const responseData = remoteMessage?.data || {};
      const currentRoute = getCurrentRoute();
      const routeName = currentRoute?.name ?? '';
      const idFromParams = currentRoute?.params?.id ?? '';
      const chatRoomFromResponseData = responseData?.chatRoom ? JSON.parse(responseData?.chatRoom) : {};
      // 채팅방에 있고, 현재 채팅방에 대한 푸시가 온다면 화면에 인앱 메시지를 표시하지 않음
      if (routeName === 'ChatRoom' && idFromParams === chatRoomFromResponseData?.id) {
        return;
      }

      let description = response.body;
      const message = response.title;

      // description이 json이면 파싱해서 data를 가져옴
      try {
        description = JSON.parse(description);
      } catch (error) {
        console.info('description is not json', error);
      }
      // data가 있는지 확인
      if (description instanceof Object) {
        switch (description.type) {
          case 'text':
            description = description?.data ?? '';
            break;
          default:
        }
      }

      showMessage({
        icon: 'logo',
        backgroundColor: '#fff',
        color: '#000',
        description,
        message,
        hideOnPress: true,
        duration: 3000,
        // autoHide: false,
        onPress: () => {
          switch (routeName) {
            case 'SinglePostDetail':
              if (responseData.post_id) {
                navigate('SinglePostDetail', {
                  key: 'SinglePostDetail' + responseData.post_id,
                  feedId: responseData?.post_id,
                  from: 'foregroundNotification',
                });
              } else {
                navigate('SinglePostDetail', {
                  key: 'SinglePostDetail' + responseData.post_id,
                  screen: 'SinglePostDetail',
                  params: {
                    feedId: responseData?.post_id,
                    from: 'foregroundNotification',
                  },
                });
              }
              break;
            default:
            // do nothing
          }

          // 채팅 메시지일 경우 채팅방으로 이동한다
          if (chatRoomFromResponseData?.id) {
            navigate('ChatRoom', {
              id: chatRoomFromResponseData?.id,
            });
          }
        },
      });
    });
  };

  const iosBackgroundNotificationAction = (remoteMessage) => {
    if (remoteMessage?.data) {
      const title = remoteMessage?.notification?.title;
      const message = remoteMessage.notification.body;
      const data = remoteMessage.data;
      const channelId = remoteMessage.messageId;
      const routeName = getCurrentRoute()?.name;

      setTimeout(() => {
        if (data.post_id) {
          if (routeName === 'SinglePostDetail') {
            navigate('SinglePostDetail', {
              key: 'SinglePostDetail' + data.post_id,
              feedId: data?.post_id,
              from: 'foregroundNotification',
            });
          } else {
            navigate('SinglePostDetail', {
              key: 'SinglePostDetail' + data.post_id,
              screen: 'SinglePostDetail',
              params: {
                feedId: data?.post_id,
                from: 'foregroundNotification',
              },
            });
          }
        }
      }, 2000);

      return PushNotification.localNotification({
        channelId,
        title,
        message,
        smallIcon: 'ic_notification',
        largeIcon: 'ic_notification',
      });
    } else {
      console.warn('there is no remoteMessage.', remoteMessage);
    }
  };

  const subscribeBackgroundNotification = () => {
    if (Platform.OS === 'ios') {
      // messaging()
      //   .onNotificationOpenedApp(iosBackgroundNotificationAction);

      messaging().getInitialNotification().then(iosBackgroundNotificationAction);
    } else {
      firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.info('Message handled in the background', remoteMessage);
        if (remoteMessage?.data) {
          const title = remoteMessage?.notification?.title;
          const message = remoteMessage.notification.body;
          const data = remoteMessage.data;
          const channelId = remoteMessage.messageId;
          const routeName = getCurrentRoute()?.name;

          PushNotification.configure({
            onNotification: function (notification) {
              if (data.post_id) {
                setTimeout(() => {
                  if (routeName === 'SinglePostDetail') {
                    navigate('SinglePostDetail', {
                      key: 'SinglePostDetail' + data.post_id,
                      feedId: data?.post_id,
                      from: 'foregroundNotification',
                    });
                  } else {
                    navigate('SinglePostDetail', {
                      key: 'SinglePostDetail' + data.post_id,
                      screen: 'SinglePostDetail',
                      params: {
                        feedId: data?.post_id,
                        from: 'foregroundNotification',
                      },
                    });
                  }
                }, 2000);
              }
            },
          });

          return PushNotification.localNotification({
            channelId,
            title,
            message,
            smallIcon: 'ic_notification',
            largeIcon: 'ic_notification',
          });
        } else {
          console.error('there is no remoteMessage.', remoteMessage);
        }
      });
    }
  };

  const updateToken = async () => {
    const authorizedEntity = firebase.app().options.messagingSenderId;
    const fcmToken = await firebase.messaging().getToken(authorizedEntity);

    const OS = Platform.OS;

    let formData = new FormData();
    formData.append('token', fcmToken);
    formData.append('os', OS);

    const [response] = await registerFCMToken(formData);
  };

  return {
    getAppleUserCredential,
    getPermissionStatus,
    requestPermission,
    removeToken,
    subscribeInAppNotification,
    subscribeBackgroundNotification,
    updateToken,
  };
};

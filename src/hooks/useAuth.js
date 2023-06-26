import React from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { getProfile, login, logout as kakaoLogout } from '@react-native-seoul/kakao-login';
import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthError,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { CommonActions } from '@react-navigation/native';

import { useFirebase } from '../utils/useFirebase';
import deleteMyInfo from '../net/user/deleteMyInfo';
import { dispatch, navigate } from '../navigators/RootNavigation';
import deleteToken from '../net/auth/deleteToken';
import handleLoginType from '../net/auth/handleLoginType';

export default function useAuth() {
  const getKakaoUserProfile = async () => {
    try {
      const kakaoResult = await login();
      const userProfile = await axios.post(
        'https://kapi.kakao.com/v2/user/me',
        {},
        {
          headers: {
            authorization: `bearer ${kakaoResult.accessToken}`,
          },
        },
      );
      return userProfile;
    } catch (error) {
      Alert.alert('카카오 로그인 실패', error.message);
    }
  };

  const getAppleUserProfile = async () => {
    try {
      const responseObject = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL],
      });

      if (!responseObject.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
      }

      const { identityToken, nonce } = responseObject;

      if (identityToken) {
        const userCredential = await useFirebase().getAppleUserCredential(identityToken, nonce);
        return userCredential.user;
      } else {
        return alert('invalid Apple identityToken');
      }
    } catch (error) {
      console.warn(error);
      if (error.code === AppleAuthError?.CANCELED || error.code === '1001') {
        console.warn('canceled');
      } else {
        console.warn('애플 로그인 실패 error : ', error);
      }
    }
  };
  const logoutKakao = async () => {
    try {
      const kakaoToken = await getProfile();
      if (kakaoToken) {
        const kakaoResult = await kakaoLogout();
      }
    } catch (error) {
      console.warn('Kakao logout error: ', error);
    }
  };

  const logoutApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGOUT,
      });
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      if (credentialState === AppleAuthCredentialState.REVOKED) {
        console.info('User is unauthenticated');
      }
      console.info('apple logout');
    } catch (appleLogoutError) {
      console.warn('Apple logout error: ', appleLogoutError);
    }
  };

  const logout = async () => {
    try {
      await deleteToken();
      dispatch((state) => {
        return CommonActions.reset({
          index: 0,
          routes: [{ name: 'AuthPage' }],
          actions: [
            navigate('AuthPage', {
              screen: 'SignIn',
            }),
          ],
        });
      });

      const loginType = await handleLoginType('get');

      if (loginType === 'kakao') {
        await logoutKakao();
      }
      if (loginType === 'apple') {
        await logoutApple();
      }

      await handleLoginType('remove');
    } catch (error) {
      console.warn('logout', error);
    }
  };

  const withdraw = async () => {
    try {
      await deleteMyInfo();
      dispatch((state) => {
        return CommonActions.reset({
          index: 0,
          routes: [{ name: 'AuthPage' }],
          actions: [
            navigate('AuthPage', {
              screen: 'SignIn',
            }),
          ],
        });
      });
      await logout();
      Alert.alert('', '탈퇴가 완료되었습니다');
    } catch (error) {
      console.warn(error);
    }
  };

  return {
    getKakaoUserProfile,
    getAppleUserProfile,
    logout,
    logoutKakao,
    logoutApple,
    withdraw,
  };
}

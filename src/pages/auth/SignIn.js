import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Image, Platform, Pressable } from 'react-native';
import { withContext } from 'context-q';
import styled from 'styled-components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import appleAuth from '@invertase/react-native-apple-authentication';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { Text } from '../../atoms/text';
import Button from '../../atoms/button/Button';
import { deviceWidth, Row, Spacer } from '../../atoms/layout';
import { Icon, Spinner } from '../../atoms/image';
import signInSocial from '../../net/auth/signInSocial';
import setToken from '../../net/auth/setToken';
import handleLoginType from '../../net/auth/handleLoginType';
import { useAuth } from '../../hooks';
import get from '../../net/core/get';
import { API_HOST } from '@env';
import { blocksAtom } from '../../stores';
import { useSetAtom } from 'jotai';

import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import LinearGradient from 'react-native-linear-gradient';

function onBackPress() {
  BackHandler.exitApp();
  return true;
}

const fbAuth = auth;

function SignInPage(props) {
  const auth = useAuth();
  const navigation = useNavigation();
  const isAppleLoginSupported = Platform.OS === 'ios' && appleAuth.isSupported;
  const [facebookData, setFacebookData] = useState();

  const [visibleLoading, setVisibleLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    if (isAppleLoginSupported) {
      return appleAuth.onCredentialRevoked(async () => {
        console.warn('If this function executes, User Credentials have been Revoked');
      });
    }
  }, []);
  const setBlocks = useSetAtom(blocksAtom);
  async function onFacebookButtonPress() {
    // Attempt login with permissions

    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    setVisibleLoading(true);

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    } else {
      setFacebookData(data);
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = fbAuth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return fbAuth().signInWithCredential(facebookCredential);
  }

  const onFacebookLoginPress = async (result) => {
    setVisibleLoading(true);

    try {
      if (result) {
        let formData = new FormData();
        formData.append('type', 'Facebook');
        formData.append('uid', result.user.uid);
        formData.append('email', result.user.email);

        const [data] = await signInSocial(formData);
        const token = data?.token?.token;

        if (data?.user?.name && data?.user?.name !== '') {
          await setToken(token);
          await handleLoginType('set', 'facebook');
          const [blocks] = await get(`${API_HOST}/v1/blocks`);
          setBlocks(blocks);
          navigation.navigate('Home');
        } else {
          Alert.alert('페이스북 회원가입', '회원가입이 완료되었습니다. 회원정보를 업데이트해주세요.');
          navigation.navigate('SignUp', {
            params: {
              signUpType: 'social',
              socialType: 'facebook',
              email: data.user?.email,
              socialToken: token,
              userData: data.user,
              gender: null,
              name: null,
            },
          });
        }
      }
      setVisibleLoading(false);
    } catch (error) {
      console.error('error', error.response);
      setVisibleLoading(false);
      if (error.response?.status === 400) {
        console.error('error', error.response);
        Alert.alert(
          '',
          `다음과 같은 이유로 로그인할 수 없습니다. \n\n-소셜 로그인 계정과 동일한 이메일로 가입된 계정이 있을 수 있습니다. \n\n-일시적으로 정지된 계정일 수 있습니다. \n\n-이미 탈퇴한 계정일 수 있습니다. \n\n일반이메일로 로그인을 시도하거나, 관리자에게 문의하세요. \n\nhttps://pairing.kr/app-ask`,
        );
      } else {
        Alert.alert('', error.message);
      }
      await auth.logoutKakao();
    } finally {
      setVisibleLoading(false);
    }
  };
  // async function onFacebookButtonPress() {
  //   // Create a nonce and the corresponding
  //   // sha256 hash of the nonce
  //   const nonce = '123456';
  //   const nonceSha256 = await sha256(nonce);
  //   // Attempt login with permissions and limited login
  //   const result = await LoginManager.logInWithPermissions(
  //       ['public_profile', 'email'],
  //       'limited',
  //       nonceSha256,
  //   );
  //
  //
  //   if (result.isCancelled) {
  //     throw 'User cancelled the login process';
  //   }
  //
  //   // Once signed in, get the users AuthenticationToken
  //   const data = await AuthenticationToken.getAuthenticationTokenIOS();
  //
  //   if (!data) {
  //     throw 'Something went wrong obtaining authentication token';
  //   }
  //
  //   // Create a Firebase credential with the AuthenticationToken
  //   // and the nonce (Firebase will validates the hash against the nonce)
  //   const facebookCredential = fbAuth.FacebookAuthProvider.credential(data.authenticationToken, nonce);
  //
  //   // Sign-in the user with the credential
  //   return fbAuth.signInWithCredential(facebookCredential);
  // }
  const onKakaoLoginPress = async () => {
    setVisibleLoading('kakao');
    try {
      const result = await auth.getKakaoUserProfile();

      if (result) {
        let formData = new FormData();
        formData.append('type', 'Kakao');
        formData.append('uid', result?.data?.id);
        if (result?.data?.kakao_account?.email) {
          formData.append('email', result?.data?.kakao_account?.email);
        } else {
          formData.append('email', result?.data?.id + '@uid.kakaoid.com');
        }

        const [data] = await signInSocial(formData);
        const token = data?.token?.token;

        if (data?.user?.name && data?.user?.name !== '') {
          await setToken(token);
          await handleLoginType('set', 'kakao');
          const [blocks] = await get(`${API_HOST}/v1/blocks`);
          setBlocks(blocks);
          navigation.navigate('Home');
        } else {
          Alert.alert('카카오 회원가입', '회원가입이 완료되었습니다. 회원정보를 업데이트해주세요.');
          navigation.navigate('SignUp', {
            params: {
              signUpType: 'social',
              socialType: 'kakao',
              email: data.user?.email,
              socialToken: token,
              userData: data.user,
              gender: null,
              name: null,
            },
          });
        }
      }
      setVisibleLoading(false);
    } catch (error) {
      console.error('error', error.response);
      setVisibleLoading(false);
      if (error.response?.status === 400) {
        console.error('error', error.response);
        Alert.alert(
          '',
          `다음과 같은 이유로 로그인할 수 없습니다. \n\n-소셜 로그인 계정과 동일한 이메일로 가입된 계정이 있을 수 있습니다. \n\n-일시적으로 정지된 계정일 수 있습니다. \n\n-이미 탈퇴한 계정일 수 있습니다. \n\n일반이메일로 로그인을 시도하거나, 관리자에게 문의하세요. \n\nhttps://pairing.kr/app-ask`,
        );
      } else {
        Alert.alert('', error.message);
      }
      await auth.logoutKakao();
    } finally {
      setVisibleLoading(false);
    }
  };

  const onAppleLoginPress = async () => {
    setVisibleLoading(true);
    try {
      const userInfo = await auth.getAppleUserProfile();

      if (userInfo?.uid) {
        let formData = new FormData();
        formData.append('type', 'Apple');
        formData.append('uid', userInfo.uid);
        formData.append('email', userInfo.email);

        const [data] = await signInSocial(formData);
        const token = data?.token?.token;

        if (data?.user?.name && data?.user?.name !== '' && data?.user?.email && data?.user?.gender_id) {
          await setToken(token);
          await handleLoginType('set', 'apple');
          const [blocks] = await get(`${API_HOST}/v1/blocks`);
          setBlocks(blocks);
          navigation.navigate('Home');
        } else {
          Alert.alert('Apple 계정 회원가입', '회원가입이 완료되었습니다. 회원정보를 업데이트 해주세요.');
          navigation.navigate('SignUp', {
            params: {
              signUpType: 'social',
              socialType: 'apple',
              email: data.user?.email,
              socialToken: token,
              userData: data.user,
              gender: null,
              name: null,
            },
          });
        }
      }
      setVisibleLoading(false);
    } catch (error) {
      console.error('error', error);
      setVisibleLoading(false);
      if (error.response?.status === 400) {
        Alert.alert(
          '',
          `다음과 같은 이유로 로그인할 수 없습니다.\n-애플계정과 동일한 이메일로 가입된 계정이 있을 수 있습니다.\n-일시적으로 정지된 계정일 수 있습니다.\n-이미 탈퇴한 계정일 수 있습니다.\n일반이메일로 로그인을 시도하거나, 관리자에게 문의하세요\nhttps://pairing.kr/app-ask`,
        );
        const appleResult = await appleAuth.Operation.LOGOUT();
      } else {
        Alert.alert('', error.message);
      }
    } finally {
      setVisibleLoading(false);
    }
  };

  return (
    <WhiteSafeArea>
      {/*<Inner*/}
      {/*  resizeMode="cover"*/}
      {/*  source={require('../../../assets/img_signin.png')}*/}
      {/*>*/}
      <LinearGradient
        colors={['#3cbdeb', '#1c97e2']}
        style={{ flex: 1 }}>
        <LogoArea>
          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceWidth * 0.5 * 0.44,
              marginTop: 18,
            }}
            resizeMode={'contain'}
            source={require('../../../assets/logo_pairing_white.png')}
            alt={'Pairing'}
          />
          <LogoText>1020의 트렌디한 중고거래 플랫폼</LogoText>
          <Spacer height={40} />
        </LogoArea>
        <AreaButtons>
          {!visibleLoading ? (
            <>
              <Button
                iconComponent={
                  <Icon
                    source={require('../../../assets/icon_kakao.png')}
                    size={30}
                  />
                }
                styles={styles.kakao}
                onPress={async () => {
                  await onKakaoLoginPress();
                }}>
                카카오톡으로 시작하기
              </Button>
              {isAppleLoginSupported && (
                <>
                  <Spacer height={13} />
                  <Button
                    iconComponent={
                      <Icon
                        source={require('../../../assets/icon_apple.png')}
                        size={30}
                      />
                    }
                    styles={styles.apple}
                    onPress={async () => {
                      await onAppleLoginPress();
                    }}>
                    Apple로 계속하기
                  </Button>
                </>
              )}
              <Spacer height={13} />
              <Button
                title='Facebook Sign-In'
                styles={styles.facebook}
                iconComponent={
                  <Icon
                    source={require('../../../assets/facebook.png')}
                    size={30}
                  />
                }
                onPress={() =>
                  onFacebookButtonPress().then((result) => {
                    onFacebookLoginPress(result);
                  })
                }>
                페이스북으로 시작하기
              </Button>
              <Spacer height={13} />
              <Button
                iconComponent={
                  <Icon
                    source={require('../../../assets/email_ic.png')}
                    size={30}
                  />
                }
                styles={styles.email}
                onPress={() => {
                  navigation.navigate('SignUp', {
                    params: {
                      signUpType: 'normal',
                      socialType: null,
                      email: null,
                      socialToken: null,
                      userData: null,
                      gender: null,
                      name: null,
                    },
                  });
                }}>
                이메일로 가입하기
              </Button>
              <Spacer height={25} />
              <Row style={{ justifyContent: 'flex-end' }}>
                <Pressable
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  onPress={() => {
                    navigation.navigate('Login');
                  }}>
                  <Text
                    size={18}
                    style={{ color: '#fff', fontWeight: '600' }}>
                    로그인
                  </Text>
                </Pressable>
              </Row>
              <Spacer height={40} />
            </>
          ) : (
            <>
              {visibleLoading === 'kakao' && (
                <Button
                  iconComponent={
                    <Icon
                      source={require('../../../assets/icon_kakao.png')}
                      size={24}
                    />
                  }
                  styles={styles.kakao}
                  onPress={async () => {
                    await onKakaoLoginPress();
                  }}>
                  카카오톡으로 시작하기
                </Button>
              )}
              <Spinner />
            </>
          )}
        </AreaButtons>
      </LinearGradient>

      {/*</Inner>*/}
    </WhiteSafeArea>
  );
}

const styles = {
  kakao: {
    container: {
      width: '85%',
      paddingHorizontal: 20,
      height: 50,
      borderRadius: 20,
      justifyContent: 'flex-start',
      backgroundColor: 'rgba(249,225,0,1)',
    },
    font: {
      fontSize: 18,
      color: '#000',
      fontWeight: '600',
    },
  },
  facebook: {
    container: {
      width: '85%',
      paddingHorizontal: 20,
      height: 50,
      justifyContent: 'flex-start',
      borderRadius: 20,
      backgroundColor: 'rgba(23,78,151,1)',
    },
    font: {
      fontSize: 18,
      color: '#fff',
      fontWeight: '500',
    },
  },
  email: {
    container: {
      borderWidth: 1,
      borderColor: 'rgba(69,69,69,0.4)',
      width: '85%',
      paddingHorizontal: 20,
      height: 50,
      borderRadius: 20,
      justifyContent: 'flex-start',
      backgroundColor: 'rgba(250,250,250,1)',
    },
    font: {
      fontSize: 18,
      color: '#000',
      fontWeight: '600',
    },
  },
  apple: {
    container: {
      borderWidth: 1,
      borderColor: '#000',
      width: '85%',
      paddingHorizontal: 20,
      height: 50,
      borderRadius: 20,
      justifyContent: 'flex-start',
      backgroundColor: '#000',
    },
    font: {
      fontSize: 18,
      color: '#fff',
      fontWeight: '500',
    },
  },
};

const Inner = styled.ImageBackground`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const LogoArea = styled.View`
  flex: 1;
  padding-bottom: 10px;
  align-items: center;
  justify-content: flex-end;
`;

const LogoText = styled.Text`
  color: #fff;
  margin-top: 30px;
  font-weight: 600;
  font-size: 18px;
`;

const AreaButtons = styled.View`
  min-height: 188px;
  padding-horizontal: 17px;
  padding-bottom: 18px;
  padding-top: 25px;
  align-items: center;
`;

SignInPage = withContext(SignInPage);
export default SignInPage;

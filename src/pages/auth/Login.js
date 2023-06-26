import React from 'react';
import styled from 'styled-components';
import { Alert, BackHandler, Pressable, ScrollView } from 'react-native';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { Text } from '../../atoms/text';
import Button from '../../atoms/button/Button';
import { Spacer } from '../../atoms/layout';
import { NavHead } from '../../components/layouts';
import { LabeledInput } from '../../atoms/form';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { withContext } from 'context-q';
import signIn from '../../net/auth/signIn';
import setToken from '../../net/auth/setToken';
import validateEmail from '../../utils/validateEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import handleLoginType from '../../net/auth/handleLoginType';
import get from '../../net/core/get';
import { API_HOST } from '@env';
import { blocksAtom } from '../../stores';
import { useSetAtom } from 'jotai';

function LoginPage(props) {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const setSignedEmail = async (email) => {
    try {
      AsyncStorage.setItem('signedId', email);
    } catch (error) {
      console.warn(error);
    }
  };
  const getSignedEmail = async (email) => {
    try {
      const value = await AsyncStorage.getItem('signedId');
      if (value !== null) {
        setEmail(value);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const setBlocks = useSetAtom(blocksAtom);
  const postSignIn = async () => {
    if (!email) return Alert.alert('', '이메일을 입력해주세요');
    if (!validateEmail(email)) return Alert.alert('', '올바른 이메일 형식이 아닙니다.');
    if (!email && !password) return Alert.alert('', '이메일과 비밀번호를 입력해주세요');
    if (!password) return Alert.alert('', '비밀번호를 입력해주세요');
    try {
      const params = {
        email,
        password,
      };
      const [data] = await signIn(params);
      await setToken(data?.token?.token);
      const [blocks] = await get(`${API_HOST}/v1/blocks`);
      setBlocks(blocks);

      props.context.update({
        ...props.context,
        user: data?.user,
        token: data?.token?.token,
      });
      setSignedEmail(email);

      if (data?.user?.name && data?.user?.gender && data?.user?.birth && data?.user?.body_type_id) {
        await handleLoginType('set', 'email');
        return CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
          actions: [
            navigation.navigate('Home', {
              screen: 'Home',
            }),
          ],
        });
      } else {
        Alert.alert('', `환영합니다! 회원정보를 업데이트 해주세요.`);
        navigation.navigate('SignUp', {
          params: {
            signUpType: 'editInfo',
            socialType: null,
            email: data.user?.email,
            gender: data.user?.gender,
            name: data.user?.name,
            socialToken: data?.token?.token,
            userData: data.user,
          },
        });
      }
    } catch (error) {
      console.warn(error.response);
      Alert.alert('', error.response?.data.message || '아이디와 비밀번호를 확인해주세요');
    }
  };

  function onBackPress() {
    navigation.dispatch((state) => {
      // Remove the home route from the stack
      const routes = state.routes.filter((r) => r.name !== 'login');

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
    navigation.navigate('AuthPage', { screen: 'SignIn' });
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
      getSignedEmail();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <WhiteSafeArea>
      <NavHead title={'로그인'} />
      <Inner>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Spacer height={20} />
          <LabeledInput
            label={'이메일 주소'}
            type={'email'}
            placeholder={'이메일 주소를 입력해주세요.'}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <LabeledInput
            label={'비밀번호'}
            placeholder={'비밀번호를 입력해주세요.'}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <PasswordRow>
            <Pressable
              onPress={() => {
                navigation.navigate('FindPassword');
              }}>
              <Text
                size={13}
                style={{ color: 'rgba(168,168,168,1)' }}>
                비밀번호를 잊으셨나요?
              </Text>
            </Pressable>
          </PasswordRow>
          <Spacer height={20} />
        </ScrollView>
        <Button onPress={postSignIn}>로그인</Button>
      </Inner>
    </WhiteSafeArea>
  );
}

const Inner = styled.View`
  flex: 1;
  padding-horizontal: 33px;
  padding-bottom: 32px;
`;

const PasswordRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-vertical: 12px;
`;

LoginPage = withContext(LoginPage);
export default LoginPage;

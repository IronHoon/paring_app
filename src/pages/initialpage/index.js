import React, { useCallback, useEffect } from 'react';
import { BackHandler, Image } from 'react-native';
import axios from 'axios';
import { withContext } from 'context-q';
import styled from 'styled-components';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '@env';

import getMyInfo from '../../net/user/getMyInfo';
import deleteToken from '../../net/auth/deleteToken';
import { WhiteSafeArea } from '../../components/layouts';
import { deviceWidth } from '../../atoms/layout';
import { navigate } from '../../navigators/RootNavigation';

function onBackPress() {
  BackHandler.exitApp();
  return true;
}

/*Splash*/
function InitialPage(props) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    (async function () {
      await checkTokenAndNavigate();
    })();
  }, []);

  const checkTokenAndNavigate = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = 'bearer ' + token;
        const [, userResponse] = await getMyInfo();
        // 내 정보가 없는 유저 체크
        if (
          userResponse?.data?.name &&
          userResponse?.data?.gender_id &&
          userResponse?.data?.birth &&
          userResponse?.data?.body_type_id
        ) {
          props.context.update({
            user: userResponse.data,
            token: token,
          });

          navigation.dispatch((state) => {
            return CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
              actions: [
                navigate('Home', {
                  screen: 'Home',
                }),
              ],
            });
          });
        } else {
          await deleteToken();
          await navigateToInitialPage();
        }
      } catch (error) {
        console.warn(error);
        await deleteToken();
        await navigateToInitialPage();
      }
    } else {
      await navigateToInitialPage();
    }
  };

  const navigateToInitialPage = async () => {
    const checked = await AsyncStorage.getItem('check_description');
    if (!checked) {
      navigation.navigate('Introduction');
    } else {
      navigation.navigate('AuthPage', { screen: 'SignIn' });
    }
  };

  return (
    <WhiteSafeArea>
      <Splash>
        <Image
          style={{
            width: deviceWidth * 0.55,
            height: deviceWidth * 0.55 * 43.91,
          }}
          resizeMode={'contain'}
          source={require('../../../assets/logo_pairing.png')}
          alt={'pairing'}
        />
      </Splash>
    </WhiteSafeArea>
  );
}

const Splash = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: #fff;
`;

const SpinnerWrapper = styled.View`
  position: absolute;
  bottom: 50px;
`;

InitialPage = withContext(InitialPage);
export default InitialPage;

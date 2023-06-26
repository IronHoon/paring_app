import React from 'react';
import styled from 'styled-components';
import { Alert, ScrollView } from 'react-native';
import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import Button from '../../../atoms/button/Button';
import { Spacer } from '../../../atoms/layout';
import { NavHead } from '../../../components/layouts';
import { LabeledInput } from '../../../atoms/form';
import { useNavigation } from '@react-navigation/native';
import { withContext } from 'context-q';
import editPassword from '../../../net/user/editPassword';

function ChangePasswordPage(props) {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');

  const patchPassword = async () => {
    if (!oldPassword) return alert('기존 비밀번호를 입력해주세요');
    if (!password) return alert('새 비밀번호를 입력해주세요');
    if (password.length < 6) return Alert.alert('비밀번호', '6자 이상의 비밀번호를 입력해주세요.');
    if (!passwordConfirm) return alert('새 비밀번호 확인란을 입력해주세요');
    if (password !== passwordConfirm) return alert('새 비밀번호 확인이 일치하지 않습니다.');
    try {
      const passwordResponse = await editPassword(oldPassword, password, passwordConfirm);

      // props.context.update({
      //   user: data?.user,
      //   token: data?.token?.token,
      // });

      Alert.alert('', '비밀번호가 성공적으로 변경되었습니다.');
      navigation.navigate('MySetting');
    } catch (error) {
      console.warn(error);
      Alert.alert('비밀번호 변경 실패', error.response.data?.message || '');
    }
  };

  return (
    <WhiteSafeArea>
      <NavHead title={'비밀번호 변경'} />
      <Inner>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Spacer height={20} />

          <LabeledInput
            label={'기존 비밀번호'}
            type={'password'}
            placeholder={'기존 비밀번호를 입력해주세요.'}
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
          />
          <Spacer height={10} />
          <LabeledInput
            label={'새 비밀번호'}
            type={'password'}
            placeholder={'새 비밀번호를 입력해주세요.'}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <LabeledInput
            label={'새 비밀번호 확인'}
            placeholder={'새 비밀번호를 다시 입력해주세요.'}
            type={'password'}
            secureTextEntry={true}
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text)}
          />
        </ScrollView>
        <Button onPress={patchPassword}>비밀번호 변경</Button>
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

ChangePasswordPage = withContext(ChangePasswordPage);
export default ChangePasswordPage;

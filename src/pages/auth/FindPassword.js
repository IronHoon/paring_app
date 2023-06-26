import React, { useState } from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { Text } from '../../atoms/text';
import Button from '../../atoms/button/Button';
import { Row, Spacer } from '../../atoms/layout';
import { NavHead } from '../../components/layouts';
import { LabeledInput } from '../../atoms/form';
import { useNavigation } from '@react-navigation/native';
import findPassword from '../../net/user/findPassword';

function FindPasswordPage({ navigation }) {
  const { navigate } = useNavigation();
  const [step, setStep] = useState('1');
  const [email, setEmail] = useState('');

  const sendEmail = async () => {
    try {
      const response = await findPassword(email);
      setStep('2');
    } catch (error) {
      let msg;
      if (error.response.data.code === 'MessageRejected') {
        msg =
          `이메일 전송에 실패했습니다. 유효한 이메일인지 확인해주세요. \n\n` + error.response.data.message ||
          error.response.data?.[0]?.message;
      } else {
        msg = error.response.data.message || error.response.data?.[0]?.message;
      }
      alert(msg);
    }
  };
  return (
    <WhiteSafeArea>
      {step === '1' && (
        <>
          <NavHead title={'비밀번호 찾기'} />
          <Inner>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <Spacer height={20} />
              <LabeledInput
                label={'이메일 주소'}
                returnKeyType={'send'}
                onSubmitEditing={sendEmail}
                type={'email'}
                placeholder={'이메일 주소를 입력해주세요.'}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <Spacer height={4} />
              <Row style={{ justifyContent: 'flex-end' }}>
                <Button
                  type={'submit'}
                  styles={{
                    container: {
                      width: 100,
                      paddingHorizontal: 5,
                    },
                    font: {
                      fontSize: 13,
                    },
                  }}
                  onPress={sendEmail}>
                  비밀번호 찾기
                </Button>
              </Row>
            </ScrollView>
          </Inner>
        </>
      )}
      {step === '2' && (
        <>
          <NavHead
            onLeftPress={() => {
              navigate('Login');
            }}
            title={'비밀번호 찾기'}
          />
          <Inner>
            <Spacer height={20} />
            <Row style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
              <Text
                size={14}
                style={{ color: '#555' }}>
                {email} 로
              </Text>
            </Row>
            <Row style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
              <Spacer height={10} />
              <Text
                size={14}
                style={{ color: '#555' }}>
                새로운 비밀번호가 전송되었습니다.
              </Text>
            </Row>
          </Inner>
        </>
      )}
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

export default FindPasswordPage;

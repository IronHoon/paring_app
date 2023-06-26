import { NavHead, WhiteSafeArea } from '../../components/layouts';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { Spacer } from '../../atoms/layout';
import { Button } from '../../atoms/button';
import { useNavigation } from '@react-navigation/native';
import post from '../../net/core/post';
import { Alert } from 'react-native';
import { useAtomValue } from 'jotai';
import { reportAtom } from '../../stores';
import { API_HOST } from '@env';

export default function ReportForm() {
  const navigation = useNavigation();
  const report = useAtomValue(reportAtom);
  const [message, setMessage] = useState('');

  const sendReport = useCallback(async () => {
    try {
      await post(`${API_HOST}/v1/reports`, {
        target_table: report.target_table,
        target_id: report.target_id,
        subject: '상세 내용 작성 / 신고하기',
        content: message,
      });
      Alert.alert('완료', '신고가 접수되었습니다.');
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.warn(error);
    }
  }, [report, message]);

  return (
    <WhiteSafeArea>
      <NavHead title='신고하기' />
      <Container>
        <Typo>이용 중 불편함을 겪으셨나요?</Typo>
        <Typo>신고 내용을 접수해주시면, 페어링이 정기적으로 검토하여 신고 항목에 대해 신속히 도움 드리겠습니다.</Typo>
        <Spacer height={20} />
        <TextArea
          placeholder='신고 내용을 입력해주세요.'
          multiline={true}
          textAlignVertical='top'
          value={message}
          onChangeText={setMessage}
        />
        <Spacer height={20} />
        <Button
          onPress={async () => {
            await sendReport();
          }}>
          페어링에게 보내기
        </Button>
      </Container>
    </WhiteSafeArea>
  );
}

const Container = styled.View`
  padding: 25px;
`;

const Typo = styled.Text`
  color: rgb(143, 144, 149);
  font-size: 16px;
`;

const TextArea = styled.TextInput`
  border: 2px solid rgb(103, 103, 103);
  border-radius: 20px;
  padding: 20px 24px;
  font-size: 16px;
  min-height: 192px;
`;

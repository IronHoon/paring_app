import React, { useCallback } from 'react';
import { NavHead, WhiteSafeArea } from '../../components/layouts';
import { Alert, Pressable, Text, View } from 'react-native';
import styled from 'styled-components/native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import post from '../../net/core/post';
import { API_HOST } from '@env';
import { useAtomValue } from 'jotai';
import { reportAtom } from '../../stores';

const subjects = [
  '선정적인 컨텐츠에요',
  '전문 판매업자 같아요',
  '사기 글이에요',
  '불법 광고 컨텐츠에요',
  '혐오 표현이 있어요',
  '기타 문제가 있어요.',
];

export default function ReportMain() {
  const navigation = useNavigation();
  const report = useAtomValue(reportAtom);

  const sendReport = useCallback(
    async (message) => {
      try {
        await post(`${API_HOST}/v1/reports`, {
          target_table: report.target_table,
          target_id: report.target_id,
          subject: message,
          content: message,
        });
        Alert.alert('완료', '신고가 접수되었습니다.');
        navigation.goBack();
      } catch (error) {
        console.warn(error);
      }
    },
    [report],
  );

  return (
    <WhiteSafeArea>
      <NavHead title='신고하기' />
      <Divider />
      <Container>
        <View style={[tw`border-b border-gray-300`, { padding: 16 }]}>
          <Text style={[tw`font-bold`, { fontSize: 16 }]}>게시글을 신고하는 이유를 선택해주세요</Text>
        </View>
        {subjects.map((subject) => (
          <Pressable
            key={subject}
            style={[tw`border-b border-gray-300 flex-row justify-between`, { padding: 16 }]}
            onPress={() => sendReport(subject)}>
            <Text style={[tw`font-black`, { fontSize: 14 }]}>{subject}</Text>
            <Text style={[tw`font-black font-bold`, { fontSize: 14 }]}>&gt;</Text>
          </Pressable>
        ))}
      </Container>
      <Divider />
      <Container>
        <View style={[tw`border-b border-gray-300`, { paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }]}>
          <Pressable
            style={[tw`flex-row justify-between`]}
            onPress={() => navigation.navigate('ReportForm')}>
            <Text>상세 내용 작성 / 신고하기</Text>
            <Text style={[tw`font-black font-bold`, { fontSize: 14 }]}>&gt;</Text>
          </Pressable>
        </View>
      </Container>
    </WhiteSafeArea>
  );
}

const Divider = styled.View`
  background: rgb(220, 220, 220);
  height: 18px;
`;

const Container = styled.View`
  padding: 18px;
`;

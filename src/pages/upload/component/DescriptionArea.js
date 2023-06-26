import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../../../atoms/text';
import { Spacer } from '../../../atoms/layout';

const TitleText = styled.Text`
  color: rgb(0, 175, 240);
  font-size: 14px;
  margin-bottom: 3px;
`;

const ContentsText = styled.Text`
  color: rgb(132, 132, 132);
  font-size: 11px;
`;
const DescriptionArea = (props) => {
  return (
    <View>
      <TitleText>나만을 위한 비쥬얼 디렉터</TitleText>
      <ContentsText>패션을 공유하고 평가해보세요. 빅데이터 분석을 통해 비쥬얼 디렉팅을 받을 수 있어요!</ContentsText>
      <Spacer height={25} />
      <TitleText>페어링 지수?</TitleText>
      <ContentsText>
        <Text
          size={11}
          style={{ color: 'rgb(0,0,0)' }}>
          ‘빅데이터 분석’
        </Text>
        을 통해 다른 유저의 패션이 나에게 얼마나 어울릴지 %로 제공되는 지표. 다른 유저 OOTD의 오른쪽 하단에서
        확인해보세요!
      </ContentsText>
      <Spacer height={25} />
      <TitleText>정확한 분석을 받는 방법!</TitleText>
      <ContentsText>
        1. 타인의 OOTD를 정확하게 자주 평가하기 {'\n'}2. 내 사진을 많이 공유하기 {'\n'}3. 키와 체형을 정확하게 입력하기{' '}
        {'\n'}데이터가 쌓일수록 더 정확한 분석을 받을 수 있어요!
      </ContentsText>
    </View>
  );
};

export default DescriptionArea;

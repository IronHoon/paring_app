import styled from 'styled-components/native';
import { Text } from '../../../atoms/text';
import React from 'react';

const ClosedHeader = (props) => {
  return (
    <Wrapper>
      <Text
        size={17}
        style={{ color: 'rgb(0,0,0)' }}>
        {props.title === 'challenge' ? '챌 린 지' : 'Like'}
      </Text>
      <Text
        size={13}
        style={{ color: 'rgb(132,132,132)', marginLeft: 16 }}>
        {props.title === 'challenge'
          ? '분석을 받거나 평점 랭킹에 도전하고 싶을 때!'
          : '좋아요로 인기랭킹에 도전하고 싶을 때!'}
      </Text>
    </Wrapper>
  );
};

const Wrapper = styled.View`
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-horizontal: 15px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export default ClosedHeader;

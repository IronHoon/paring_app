import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../atoms/image';

const StyleItem = ({ size = 65, source, name, score, ...props }) => {
  return (
    <Container>
      <ImageContainer>
        <Icon
          source={source}
          size={size}
        />
      </ImageContainer>
      <Name>{name}</Name>
      <Score>{score !== null ? parseFloat(score?.toFixed(2)) : '-'}</Score>
    </Container>
  );
};

const Container = styled.View`
  width: 25%;
  align-items: center;
  margin-bottom: 24px;
`;
const ImageContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 70px;
`;
const Name = styled.Text`
  text-align: center;
  font-size: 13px;
  letter-spacing: -0.32px;
  margin-top: 8px;
  line-height: 15px;
`;
const Score = styled.Text`
  font-size: 17px;
  letter-spacing: -0.42px;
  text-align: center;
  margin-top: 8px;
  line-height: 20px;
`;

export default StyleItem;

import React from 'react';
import styled from 'styled-components';

const AverageItem = ({ label, value }) => {
  return (
    <Container>
      <Value>{value}</Value>
      <Label>{label}</Label>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  align-content: center;
`;
const Value = styled.Text`
  color: #000;
  font-size: 17px;
  letter-spacing: -0.24px;
  margin-bottom: 4px;
  text-align: center;
`;
const Label = styled.Text`
  text-align: center;
  color: rgb(124, 124, 124);
  letter-spacing: -0.32px;
`;

export default AverageItem;

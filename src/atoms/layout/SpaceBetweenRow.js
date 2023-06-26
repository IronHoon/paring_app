import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SpaceBetweenRow = (props) => {
  return <Container {...props} />;
};
export default SpaceBetweenRow;

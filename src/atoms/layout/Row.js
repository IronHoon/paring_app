import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  ${({ centered }) => (centered ? `align-items:center` : ``)};
`;

const Row = (props) => {
  return (
    <Container
      centered={props.centered}
      {...props}
    />
  );
};
export default Row;

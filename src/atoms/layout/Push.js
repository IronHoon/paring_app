import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
`;

const Push = (props) => {
  return <Container {...props} />;
};
export default Push;

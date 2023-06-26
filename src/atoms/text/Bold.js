import React from 'react';
import styled from 'styled-components';

function Text(props) {
  const size = props.size || 15;

  return (
    <Component
      size={size}
      {...props}
    />
  );
}

const Component = styled.Text`
  font-size: ${({ size }) => (size ? size + 'px' : `15px`)};
  font-weight: bold;
  letter-spacing: -0.35px;
`;

export default Text;

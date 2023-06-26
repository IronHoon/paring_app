import React from 'react';
import styled from 'styled-components';

function Text(props) {
  const size = props.size || 15;

  return (
    <Component
      size={size}
      color={props.color}
      {...props}
    />
  );
}

const Component = styled.Text`
  font-size: ${({ size }) => (size ? size + 'px' : `15px`)};
  letter-spacing: -0.35px;
  ${({ color }) => (color ? `color: ${color}` : `color:#000`)};
  ${({ align }) => (align ? `text-align:${align}` : ``)};
  ${({ bold }) => (bold ? `font-weight:bold` : ``)};
`;

export default Text;

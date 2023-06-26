import React from 'react';
import styled from 'styled-components';

const Hr = (props) => {
  return (
    <Component
      {...props}
      color={props.color}
    />
  );
};

const Component = styled.View`
  height: 1px;
  background-color: ${({ color }) => (color ? `${color};` : `#000`)};
`;
export default Hr;

import React from 'react';
import styled from 'styled-components';
import COLOR from '../../../constants/COLOR';

const GraySpace = ({ height = 17 }) => {
  return <Component height={height} />;
};

const Component = styled.View`
  width: 100%;
  background-color: ${COLOR.SPACE_BG};
  border-color: ${COLOR.BORDER};
  border-top-width: 1px;
  border-bottom-width: 1px;
`;
export default GraySpace;

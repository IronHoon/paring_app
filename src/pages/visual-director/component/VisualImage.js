import React from 'react';
import styled from 'styled-components/native';

import { deviceWidth } from '../../../atoms/layout/DeviceWidth';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';

const ImageContainer = styled.View`
  width: ${deviceWidth}px;
  height: ${(deviceWidth * 0.6133)?.toFixed(0)}px;
  background-color: #eee;
`;

const VisualImage = ({ source, resizeMode = 'cover', ...props }) => {
  return (
    <ImageContainer>
      <PressableOndemandImage
        imgSrc={source}
        defaultImg={require('../../../../assets/profile_square.png')}
        width={'100%'}
        height={'100%'}
      />
    </ImageContainer>
  );
};
export default VisualImage;

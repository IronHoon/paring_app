import React from 'react';
import styled from 'styled-components/native';

import { Spinner } from './image';
import { View } from 'react-native';

const Component = styled.View`
  position: absolute;
  z-index: 999;
  elevation: 3;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-bottom: 30%;
  background-color: rgba(0, 0, 0, 0.6);
`;
const Text = styled.Text`
  font-size: 16px;
  line-height: 26px;
  color: rgb(245, 250, 250);
  text-align: center;
`;
const LoadingCover = ({ text }) => {
  return (
    <Component>
      <View style={{ height: 100 }}>
        <Spinner />
      </View>
      {text && <Text>{text}</Text>}
    </Component>
  );
};

export default LoadingCover;

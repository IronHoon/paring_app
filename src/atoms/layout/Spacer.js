import React from 'react';
import { View } from 'react-native';

const Spacer = (props) => {
  if (props.width || props.height) {
    return <View style={{ width: props.width, height: props.height }} />;
  }

  return <View style={{ width: props.size, height: props.size }} />;
};
export default Spacer;

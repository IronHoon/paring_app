import React from 'react';
import { View } from 'react-native';

const WhiteView = (props) => {
  return <View style={{ flex: 1, backgroundColor: '#fff' }}>{props.children}</View>;
};

export default WhiteView;

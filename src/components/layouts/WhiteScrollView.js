import React from 'react';
import { ScrollView } from 'react-native';

const WhiteScrollView = (props) => {
  return (
    <ScrollView
      style={{ backgroundColor: '#fff' }}
      onScroll={props?.onScroll}
      {...props}
    />
  );
};

export default WhiteScrollView;

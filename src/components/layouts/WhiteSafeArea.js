import React from 'react';
import { Platform, SafeAreaView, View } from 'react-native';

const WhiteSafeArea = (props) => {
  if (Platform.OS === 'ios')
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1 }}>{props.children}</View>
      </SafeAreaView>
    );
  else return <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>{props.children}</SafeAreaView>;
};

export default WhiteSafeArea;

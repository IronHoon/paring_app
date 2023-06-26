import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Icon } from '../../atoms/image';
import { SafeAreaView, View } from 'react-native';
import React from 'react';

export function ImageViewer({ route }: any) {
  const { uri } = route.params;
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={tw`bg-white absolute top-2 left-2 z-100 p-2 rounded-full opacity-50`}>
        <Icon
          source={require('../../../assets/back.png')}
          size={23}
          onPress={() => navigation.goBack()}
          onPressIn={undefined}
        />
      </View>
      {/*<NavHead*/}
      {/*  title={undefined}*/}
      {/*  right={undefined}*/}
      {/*  children={undefined}*/}
      {/*  onLeftPress={() => {*/}
      {/*    navigation.goBack();*/}
      {/*  }}*/}
      {/*  left={undefined}*/}
      {/*/>*/}
      <FastImage
        source={{ uri }}
        resizeMode={FastImage.resizeMode.contain}
        style={{ width: '100%', height: '100%' }}
      />
    </SafeAreaView>
  );
}

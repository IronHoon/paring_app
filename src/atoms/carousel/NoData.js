import React from 'react';
import { View } from 'react-native';
import { deviceHeight } from '../layout/DeviceHeight';
import { Text } from '../text';
import { Icon } from '../image';
import { Spacer } from '../layout';

function NoData({ height, text, children, ...props }) {
  return (
    <View
      style={{
        height: height || deviceHeight - 400,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '20%',
      }}>
      <View style={{ opacity: 0.5 }}>
        <Icon
          source={require('../../../assets/iconLogoBlack.png')}
          size={100}
        />
      </View>
      <Spacer height={1} />
      <Text style={{ color: '#555', fontSize: 16 }}>{text || '게시물이 없습니다.'}</Text>
      {children}
    </View>
  );
}

export default NoData;

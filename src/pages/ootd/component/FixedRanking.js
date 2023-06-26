import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Text } from '../../../atoms/text';
import { Spacer } from '../../../atoms/layout';

const FixedRanking = (props) => {
  const { info, setRankingMode, period, setPeriod, nthWeek, setNthWeek } = props;
  return (
    <Pressable
      onPress={() => {
        setRankingMode('detail');
        // setPeriod(info?.period);
      }}>
      <View style={{ alignItems: 'center' }}>
        <Text size={17}>
          {period?.format('YYYY년 MM월 ')} {nthWeek}주차
        </Text>
        <Spacer height={13} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ width: 122, height: 301 }}
              source={require('../../../../assets/dummy/no_img.png')}
            />
            <Spacer width={10} />
            <Text size={17}>WOMAN</Text>
          </View>
          <Spacer width={21} />
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ width: 122, height: 301 }}
              source={require('../../../../assets/dummy/no_img.png')}
            />
            <Spacer width={10} />
            <Text size={17}>MAN</Text>
          </View>
        </View>
        <Spacer height={50} />
      </View>
    </Pressable>
  );
};

export default FixedRanking;

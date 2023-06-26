import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../atoms/text';
import UserIdAndStar from './UserIdAndStar';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import { Spacer } from '../../../atoms/layout';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';
import { deviceWidth } from '../../../atoms/layout/DeviceWidth';

const RankingDetailHeader = (props) => {
  const { data, handlePress } = props;

  return (
    <PressableWrapper
      onPress={() => {
        handlePress(data);
      }}>
      <PressableOndemandImage
        imgSrc={data?.image}
        defaultImg={require('../../../../assets/defaultProfileImage.png')}
        width={deviceWidth - 20}
        height={(deviceWidth - 20) * 0.61}
      />
      <Content>
        <Spacer width={36} />
        <View style={{ flex: 1 }}>
          <UserIdAndStar
            rankingItem={data}
            isFirst={true}
          />
        </View>
        <ArrowImage
          resizeMode='contain'
          style={{ tintColor: '#000' }}
          source={require('../../../../assets/arrow_down.png')}
        />
      </Content>
      <RankOne>
        <Text
          size={17}
          style={{ color: '#fff', lineHeight: 17, fontWeight: 'bold' }}>
          1
        </Text>
        <Text
          size={18}
          style={{ color: '#fff', lineHeight: 17 }}>
          -
        </Text>
      </RankOne>
    </PressableWrapper>
  );
};

const PressableWrapper = styled.Pressable`
  height: 266px;
`;
const Content = styled.View`
  position: absolute;
  bottom: 0;
  left: 25px;
  right: 25px;
  height: 116px;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-color: rgb(220, 220, 220);
  border-width: 1px;
`;

const RankOne = styled.View`
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 57px;
  left: 25px;
  bottom: 126px;
  padding-top: 9px;
  background-color: #111;
`;
const ArrowImage = styled.Image`
  transform: rotate(270deg);
  width: 18px;
  height: 9px;
  margin-right: 20px;
`;

export default RankingDetailHeader;

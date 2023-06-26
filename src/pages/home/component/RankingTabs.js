import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import SubTitleArea from './SubtitleArea';
import Spacer from '../../../atoms/layout/Spacer';

const TabWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 2px;
  height: 28px;
`;

const TabText = styled.Text`
  font-size: 15px;
  line-height: 17px;
  letter-spacing: -0.6px;
  color: ${({ active }) => (active ? 'rgba( 0, 175, 240,1)' : 'rgba(136, 136, 136, 1)')};
`;

const RankingTabs = ({ activeTabIndex, handleActiveTabIndex, subtitle, ...props }) => {
  return (
    <>
      <TabWrapper>
        <Pressable
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => {
            handleActiveTabIndex(0);
          }}>
          <TabText active={activeTabIndex === 0}>챌린지 랭킹</TabText>
        </Pressable>
        <Pressable
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => {
            handleActiveTabIndex(1);
          }}>
          <TabText active={activeTabIndex === 1}>LIKE 랭킹</TabText>
        </Pressable>
        <Pressable
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => {
            handleActiveTabIndex(2);
          }}>
          <TabText active={activeTabIndex === 2}>어제 랭킹</TabText>
        </Pressable>
      </TabWrapper>
      <SubTitleArea subTitle={subtitle} />
      <Spacer height={7} />
    </>
  );
};

export default RankingTabs;

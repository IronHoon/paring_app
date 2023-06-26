import React from 'react';
import { Pressable, View } from 'react-native';
import styled from 'styled-components/native';
import COLOR from '../../../../constants/COLOR';
import { useNavigation } from '@react-navigation/native';

const TabWrapper = styled.View`
  border-bottom-color: rgba(220, 220, 220, 0.5);
  border-bottom-width: 1px;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const TabText = styled.Text`
  color: ${(props) => (props.activeTab === props.tabName ? 'rgb(0, 0,0)' : 'rgba(136, 136, 136, 1)')};
  line-height: 18px;
  font-size: 15px;
`;

const TabImage = styled.Image`
  width: 18px;
  height: 18px;
`;

const UnderBarView = styled.View`
  flex: 1;
  min-width: 30px;
  align-items: center;
  justify-content: center;
  // border-bottom-width: 2px;
  // // border-bottom-color: ${(props) => (props.activeTab === props.tabName ? COLOR.PRIMARY : '#fff')};
`;

const UpperTabs = ({ tabs, activeTabIndex, setVisibleSearchModal, handleActiveTab }) => {
  const tabList = [
    { tabName: 'daily', title: '데일리룩' },
    { tabName: 'merchandise', title: '상품' },
    { tabName: 'ranking', title: '랭킹' },
    { tabName: 'visualDirector', title: '비주얼 디렉터' },

    { tabName: 'bookmark', title: 'bookmark', src: require('../../../../assets/bookmark.png') },
  ];

  const navigation = useNavigation();
  return (
    <TabWrapper>
      {tabList.map((tab, index) => {
        return (
          <Pressable
            key={index.toString()}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              if (tab.tabName === 'bookmark') {
                navigation.navigate('BookmarkPage');
              } else if (tab.tabName === 'visualDirector') {
                navigation.navigate('VisualDirector', {
                  screen: 'VisualDirector',
                  params: { back: true },
                });
              } else {
                handleActiveTab(tab.tabName);
                tab.onPress?.();
              }
            }}>
            <UnderBarView
              tabName={tab.tabName}
              activeTab={tabList[activeTabIndex]?.tabName}>
              {!tab.src ? (
                <TabText
                  tabName={tab.tabName}
                  activeTab={tabList[activeTabIndex]?.tabName}>
                  {tab.title}
                </TabText>
              ) : (
                <TabImage
                  resizeMode={'contain'}
                  source={tab.src}
                  tabName={tab.tabName}
                  activeTab={tabList[activeTabIndex]?.tabName}
                  style={{
                    tintColor:
                      tabList[activeTabIndex]?.tabName === tab.tabName ? 'rgb(0,0,0)' : 'rgba(136, 136, 136, 1)',
                  }}
                />
              )}
            </UnderBarView>
            <View
              style={{
                position: 'absolute',
                borderBottomWidth: 2,
                bottom: -1,
                width: '100%',
                borderBottomColor: tabList[activeTabIndex]?.tabName === tab.tabName ? COLOR.PRIMARY : 'transparent',
              }}></View>
          </Pressable>
        );
      })}
    </TabWrapper>
  );
};

export default UpperTabs;

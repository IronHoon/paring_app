import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { Spacer } from '../../../atoms/layout';

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
  flex-direction: row;
  flex: 1;
  min-width: 30px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => (props.activeTab === props.tabName ? '#000' : '#fff')};
`;

const ProductListTabs = ({ tabs, activeTabIndex, setVisibleSearchModal, handleActiveTab }) => {
  const tabList = [
    { tabName: 'all', title: '전체 상품' },
    { tabName: 'search', title: '카테고리 검색' },
  ];

  return (
    <TabWrapper>
      {tabList.map((tab, index) => {
        return (
          <Pressable
            key={index.toString()}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              handleActiveTab(tab.tabName);
              tab.onPress?.();
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
                <>
                  <TabText
                    tabName={tab.tabName}
                    activeTab={tabList[activeTabIndex]?.tabName}>
                    {tab.title}
                  </TabText>
                  <Spacer size={8} />
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
                </>
              )}
            </UnderBarView>
          </Pressable>
        );
      })}
    </TabWrapper>
  );
};

export default ProductListTabs;

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { withContext } from 'context-q';
import { useNavigation } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import styled from 'styled-components';

import { deviceWidth } from '../../../atoms/layout/DeviceWidth';
import GridSlide from './GridSlide';
import NoData from '../../../atoms/carousel/NoData';
import { Button } from '../../../atoms/button';
import RankingTabs from './RankingTabs';
import { useAtomValue } from 'jotai';
import { blocksAtom } from '../../../stores';

const tabViewPadding = 18;
const thumbMargin = 4;
const thumbSize = (deviceWidth - tabViewPadding * 2) / 3 - thumbMargin + 4;
const tabViewHeight = thumbSize * 4 + 68;

const TabView = (props) => {
  const { slideType, postsData, femaleWinner, maleWinner, genderWinnerDate } = props;
  const blocks = useAtomValue(blocksAtom);
  const filtered = useMemo(() => {
    if (postsData.length) {
      // 게시물 차단 필터
      let _filtered = postsData.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'posts').map((block) => block.target_id);
        return !blockIds.includes(post.id);
      });
      // 사용자 차단 필터
      _filtered = _filtered.filter((post) => {
        const blockIds = blocks.filter((block) => block.target_table === 'users').map((block) => block.target_id);
        return !blockIds.includes(post.user_id);
      });
      return _filtered;
    } else {
      return postsData;
    }
  }, [postsData, blocks]);

  return (
    <View style={{ width: thumbSize * 3, flexShrink: 0 }}>
      {!filtered || filtered?.length === 0 ? (
        <NoData />
      ) : (
        <GridSlide
          slideType={slideType}
          sliderHeight={500}
          postsData={filtered}
          thumbSize={thumbSize}
          thumbMargin={thumbMargin}
          femaleWinner={femaleWinner}
          maleWinner={maleWinner}
          genderWinnerDate={genderWinnerDate}
        />
      )}
    </View>
  );
};

let RankingSection = (props) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const navigation = useNavigation();
  const tabViewRef = React.useRef();

  const handleActiveTabIndex = (tab) => {
    setActiveTabIndex(tab);

    if (activeTabIndex !== tab) {
      tabViewRef?._component?.goToPage?.(tab) || tabViewRef?.current?.goToPage?.(tab);
    }
  };
  let time = props.basisDate?.split(' ');
  if (time) time = [time[0].split('-')[1], time[0].split('-')[2], time[1].split(':')[0]];

  return (
    <View>
      {/*Tab View*/}
      <View style={{ height: tabViewHeight }}>
        <ScrollableTabView
          ref={tabViewRef}
          initialPage={0}
          renderTabBar={(tabs) => (
            <RankingTabs
              subtitle={`${
                time ? `${time[0]}월 ${time[1]}일 ${time[2]}시` : '-'
              } 기준(랭킹화면을 인스타그램에 인증하시면 포인트를 드려요)`}
              tabs={tabs}
              activeTabIndex={tabs.activeTab}
              handleActiveTabIndex={handleActiveTabIndex}
            />
          )}
          onChangeTab={(tab) => {
            handleActiveTabIndex(tab.i);
          }}>
          <TabViewContainer
            tabLabel={'all'}
            key={'all'}>
            <TabView
              slideType={'all'}
              postsData={props.allData}
              femaleWinner={props.femaleWinner}
              maleWinner={props.maleWinner}
              genderWinnerDate={props.genderWinnerDate}
            />
          </TabViewContainer>
          <TabViewContainer
            tabLabel={'style'}
            key={'style'}>
            <TabView
              slideType={'style'}
              postsData={props.styleData}
            />
          </TabViewContainer>
          <TabViewContainer
            tabLabel={'yesterday'}
            key={'yesterday'}>
            <TabView
              slideType={'yesterday'}
              postsData={props.yesterdayData}
              femaleWinner={props.femaleWinner}
              maleWinner={props.maleWinner}
              genderWinnerDate={props.genderWinnerDate}
            />
          </TabViewContainer>
        </ScrollableTabView>
      </View>

      {/*Button*/}
      <View style={{ paddingHorizontal: 20 }}>
        <Button
          backgroundColor={'rgba(136, 136, 136, 0.2)'}
          fontColor={'#000'}
          buttonHeight={'48px'}
          onPress={() => {
            navigation.navigate('Ootd', {
              screen: 'Ootd',
              params: {
                activeTab: 'ranking',
                from: 'home',
              },
            });
          }}>
          주간랭킹 더보기
        </Button>
      </View>
    </View>
  );
};

const TabViewContainer = styled.View`
  padding: 0 ${tabViewPadding}px;
  align-items: center;
`;

RankingSection = withContext(RankingSection);
export default RankingSection;

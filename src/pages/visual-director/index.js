import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Animated, BackHandler, Easing, RefreshControl, ScrollView } from 'react-native';
import moment from 'moment';
import _ from 'lodash';

import getMyPosts from '../../net/user/getMyPosts';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { LogoHeader, NavHead } from '../../components/layouts';
import VisualSection from './component/VisualSection';
import ScoreBarChart from './component/ScoreBarChart';
import { GraySpace, Hr, Row, Spacer } from '../../atoms/layout';
import AverageItem from './component/AverageItem';
import GenderLineChart from './component/GenderLineChart';
import StyleItem from './component/StyleItem';
import WeeklyBestItem from './component/WeeklyBestItem';
import MyVoteItem from './component/MyVoteItem';
import MoreButton from './component/MoreButton';
import { Bold } from '../../atoms/text';
import getVisualDirectors from '../../net/user/getVisualDirectors';
import averageScoreLabels from './utils/averageScoreLabels';
import visualCategoryData from './utils/visualCategoryData';
import getMyRatings from '../../net/user/getMyRatings';
import { withContext } from 'context-q';
import { Spinner } from '../../atoms/image';

function VisualDirectorPage(props) {
  const [loading, setLoading] = useState(true);
  const [foldStyle, setFoldStyle] = useState(true);
  const [foldWeeklyBest, setFoldWeeklyBest] = useState(true);
  const [foldMyVote, setFoldMyVote] = useState(true);
  const [isBack, setIsBack] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const isFemale = props.context.user?.gender_id === 1;
  const [myVoteData, setMyVoteData] = React.useState([]);
  const [visualSectionFeed, setVisualSectionFeed] = React.useState(null);
  const [weeklyBestData, setWeeklyBestData] = React.useState([]);

  const [scoreData, setScoreData] = React.useState([]);
  const [scoreBiggestDataIndex, setScoreBiggestDataIndex] = React.useState([]);

  //남녀 주간 평균
  /*소수점 둘째자리 수까지 표시*/

  const [weeklyAverageData, setWeeklyAverageData] = React.useState({ female: [], male: [] });

  //카테고리별 점수
  const [categoryData, setCategoryData] = React.useState([]);

  useEffect(() => {
    fetchMyVoteData();
    getPostsData();
    if (!!props.route?.params.back) {
      setIsBack(true);
    } else {
      setIsBack(false);
    }
  }, [props.route?.params]);

  const onRefresh = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      fetchMyVoteData();
      getPostsData();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // useFocusEffect(useCallback(()=>{
  //
  // },[props]))

  // data fetch
  const getPostsData = async () => {
    setLoading(true);
    try {
      //최상단 이미지 데이터
      const [visualSectionData] = await getMyPosts(1, '', { order: 'rate' });
      const visualPost = visualSectionData?.data[0];
      setVisualSectionFeed(visualPost);

      const thisMonday = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');

      //패션점수분포

      const [data] = await getVisualDirectors();
      setAverageScore({
        total: data?.averages?.all,
        male: data?.averages?.men,
        female: data?.averages?.women,
      });

      setScoreData(data?.distributions);
      //biggestDataIndex
      let maxValue = _.maxBy(data?.distributions);
      let _biggestArr = data?.distributions
        ?.map((item, index) => {
          if (item === maxValue) return index;
        })
        ?.filter((v) => v !== undefined);
      setScoreBiggestDataIndex(_biggestArr);

      //남녀 주간 평균
      const weeklyFemaleArray = [];
      const weeklyMaleArray = [];

      data?.weekly?.forEach((item) => {
        weeklyFemaleArray?.push(item?.women);
        weeklyMaleArray?.push(item?.men);
      });

      setWeeklyAverageData({
        female: weeklyFemaleArray,
        male: weeklyMaleArray,
      });

      //카테고리 별 점수
      visualCategoryData(data, setCategoryData);

      //my weekly best 데이터
      const [weeklyBest] = await getMyPosts(1, '', { order: 'rate', startDate: thisMonday });
      const weeklyBestPost = weeklyBest?.data?.[0];

      const [weeklyWomenBest] = await getMyPosts(1, '', { order: 'rate_women', startDate: thisMonday });
      const weeklyWomenBestPost = weeklyWomenBest?.data?.[0];

      const [weeklyMenBest] = await getMyPosts(1, '', { order: 'rate_men', startDate: thisMonday });
      const weeklyMenBestPost = weeklyMenBest?.data?.[0];

      const [weeklyTeenBest] = await getMyPosts(1, '', { order: 'rate_10', startDate: thisMonday });
      const weeklyTeenBestPost = weeklyTeenBest?.data?.[0];

      const [weeklyTwentyBest] = await getMyPosts(1, '', { order: 'rate_20', startDate: thisMonday });
      const weeklyTwentyBestPost = weeklyTwentyBest?.data?.[0];

      setWeeklyBestData([
        {
          feed: weeklyTwentyBestPost,
          thumb: weeklyTwentyBestPost?.ratings_average !== 0 ? weeklyBestPost?.image : null,
          title: '이번 주 가장 높은 점수 패션',
          score: parseFloat(weeklyBestPost?.ratings_average?.toFixed?.(2)),
        },
        {
          feed: weeklyWomenBestPost,
          thumb: weeklyWomenBestPost?.ratings_average_women !== 0 ? weeklyWomenBestPost?.image : null,
          title: '이번 주 여성에게 인기 패션 ',
          score: parseFloat(weeklyWomenBestPost?.ratings_average_women?.toFixed?.(2)),
        },
        {
          feed: weeklyMenBestPost,
          thumb: weeklyMenBestPost?.ratings_average_men !== 0 ? weeklyMenBestPost?.image : null,
          title: '이번 주 남성에게 인기 패션 ',
          score: parseFloat(weeklyMenBestPost?.ratings_average_men?.toFixed?.(2)),
        },
        {
          feed: weeklyTeenBestPost,
          thumb: weeklyTeenBestPost?.ratings_average_10 !== 0 ? weeklyTeenBestPost?.image : null,
          title: '이번 주 10대 인기 패션 ',
          score: parseFloat(weeklyTeenBestPost?.ratings_average_10?.toFixed?.(2)),
        },
        {
          feed: weeklyTwentyBestPost,
          thumb: weeklyTwentyBestPost?.ratings_average_20 !== 0 ? weeklyTwentyBestPost?.image : null,
          title: '이번 주 20대 인기 패션',
          score: parseFloat(weeklyTwentyBestPost?.ratings_average_20?.toFixed?.(2)),
        },
      ]);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 나의 평가 기록
  const myVoteScores = [5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5];
  const fetchMyVoteData = async () => {
    try {
      const [data] = await getMyRatings();
      const result = myVoteScores.map((v, i) => ({ score: v, dataset: data[v] }));
      setMyVoteData(result);
    } catch (error) {
      console.warn(error);
    }
  };

  const [averageScore, setAverageScore] = React.useState({
    total: 0,
    male: 0,
    female: 0,
  });
  let averageScoreLabel = '-';
  const getAverageScoreLabel = (score) => {
    const labels = Object.entries(averageScoreLabels).sort((a, b) => a[0] < b[0]);

    if (score <= labels[labels.length - 1]?.[0]) {
      averageScoreLabel = labels[labels.length - 1][1];
    } else {
      for (let i = 0; i < labels.length - 1; i++) {
        if (score > labels[i + 1]?.[0]) {
          averageScoreLabel = labels[i][1];
          break;
        }
      }
    }
  };
  if (averageScore?.total !== null) getAverageScoreLabel(averageScore?.total);
  else averageScoreLabel = '스타일을 공유하고 분석을 받아보세요.';

  /*scroll*/
  const headerHeight = 44;
  const scrollY = useRef();
  const [scrollWay, setScrollWay] = useState(null);

  const [animatedValue] = useState(new Animated.Value(0));
  const [animatedValue2] = useState(new Animated.Value(0));

  const animatedTransformY = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, -44] });
  const animatedOpacity = animatedValue2.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const checkHeaderScrolled = (e) => {
    const newScrollY = e.nativeEvent.contentOffset.y;

    if (newScrollY > headerHeight && newScrollY !== scrollY.current) {
      const newScrollWay = newScrollY - scrollY.current > 0 ? 'down' : 'up';
      newScrollWay !== scrollWay && setScrollWay(newScrollWay);

      scrollY.current = e.nativeEvent.contentOffset.y;
    }
  };

  const navigation = useNavigation();
  const onBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    const v = scrollWay === 'down' ? 1 : 0;
    Animated.timing(animatedValue, {
      toValue: v,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
    Animated.timing(animatedValue2, {
      toValue: v,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [scrollWay]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <WhiteSafeArea>
      <LogoHeader isBack={isBack} />
      <Animated.View
        style={[styles.header, { transform: [{ translateY: animatedTransformY }], opacity: animatedOpacity }]}>
        <NavHead
          left={<></>}
          title={'VISUAL DIRECTOR'}
        />
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScroll={checkHeaderScrolled}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <VisualSection
          source={visualSectionFeed?.image}
          star={visualSectionFeed?.ratings_average || 0}
        />

        <Container>
          <Section>
            <Title>패션 점수 분포</Title>
            <RedText>{averageScoreLabel}</RedText>
            <ScoreBarChart
              data={scoreData}
              biggestDataIndex={scoreBiggestDataIndex}
            />
            <Spacer height={26} />
            <Row>
              <AverageItem
                label={'전체 평균'}
                value={averageScore?.total ? parseFloat(averageScore?.total?.toFixed?.(2)) : '-'}
              />
              <AverageItem
                label={'여자 평균'}
                value={averageScore?.female ? parseFloat(averageScore?.female?.toFixed?.(2)) : '-'}
              />
              <AverageItem
                label={'남자 평균'}
                value={averageScore?.male ? parseFloat(averageScore?.male?.toFixed?.(2)) : '-'}
              />
            </Row>
          </Section>

          <Hr color={'rgb(220,220,220)'} />

          <Section>
            <Title>남녀 주간 평균</Title>
            <GenderLineChart dataset={weeklyAverageData} />
          </Section>
        </Container>
        <GraySpace />
        <Container>
          <Section>
            <Title style={{ marginBottom: 0 }}>카테고리 별 점수</Title>

            <FoldWrapper
              hide={foldStyle}
              maxHeight={420}>
              {categoryData.map(({ label, data }, categoryIndex) => (
                <StyleWrapper key={`${categoryIndex}`}>
                  <Bold size={15}>{label}</Bold>
                  <StyleList>
                    {data.map(({ icon, name, score, size, femaleOnly }, index) => {
                      if (femaleOnly && isFemale) {
                        return false;
                      } else {
                        return (
                          <StyleItem
                            key={name}
                            source={icon}
                            name={name}
                            score={score}
                            size={size}
                          />
                        );
                      }
                    })}
                  </StyleList>
                  {categoryIndex !== categoryData.length - 1 && <Hr color={'rgb(220,220,220)'} />}
                </StyleWrapper>
              ))}
            </FoldWrapper>

            <MoreButton
              fold={foldStyle}
              onPress={() => {
                setFoldStyle(!foldStyle);
              }}
            />
          </Section>
        </Container>
        <GraySpace />
        <Container>
          <Section>
            <Title>MY WEEKLY BEST</Title>
            <FoldWrapper
              hide={foldWeeklyBest}
              maxHeight={170}>
              {weeklyBestData.map(({ feed, thumb, title, score }, index) => {
                return (
                  <WeeklyBestItem
                    thumb={thumb}
                    title={title}
                    score={score}
                    feed={feed}
                    key={`${index}`}
                  />
                );
              })}
            </FoldWrapper>

            <MoreButton
              fold={foldWeeklyBest}
              onPress={() => {
                setFoldWeeklyBest(!foldWeeklyBest);
              }}
            />
          </Section>
        </Container>
        <GraySpace />
        <Container>
          <Section>
            <Title>나의 평가 기록</Title>
            <FoldWrapper
              hide={foldMyVote}
              maxHeight={350}>
              {myVoteData?.map(({ score, dataset }, index) => (
                <MyVoteItem
                  key={`${index}`}
                  score={score}
                  dataset={dataset}
                />
              ))}
            </FoldWrapper>

            <MoreButton
              fold={foldMyVote}
              onPress={() => {
                setFoldMyVote(!foldMyVote);
              }}
            />
          </Section>
        </Container>
      </ScrollView>
    </WhiteSafeArea>
  );
}

const styles = {
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    // top:Platform.OS === 'ios'? 44:0,
    top: 44,
    width: '100%',
    zIndex: 1,
  },
};

const Container = styled.View`
  padding-horizontal: 15px;
`;
const Section = styled.View`
  padding-top: 34px;
  padding-bottom: 24px;
`;
const Title = styled.Text`
  margin-bottom: 30px;
  font-size: 17px;
`;
const RedText = styled.Text`
  text-align: center;
  font-size: 13px;
  color: rgba(240, 23, 23, 1);
`;
const StyleWrapper = styled.View`
  margin-top: 30px;
`;

const StyleList = styled.View`
  flex-direction: row;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const FoldWrapper = styled.View`
  overflow: hidden;
  ${(props) => (props.hide ? `max-height:${props.maxHeight}px` : ``)}
`;
export default withContext(VisualDirectorPage);

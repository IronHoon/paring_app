import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { NavHead, WhiteSafeArea, WhiteScrollView } from '../../../components/layouts';
import { Spacer } from '../../../atoms/layout';
import SpreadableRanking from '../component/SpreadableRanking';
import { Spinner } from '../../../atoms/image';
import getWeeklyRanking from '../../../net/ranking/getWeeklyRanking';
import { withContext } from 'context-q';
import NoData from '../../../atoms/carousel/NoData';
import weekNumberInMonth from '../../../utils/WeekNumberInMonth';
import RankingDetail from '../component/RankingDetail';

function RankingPage(props) {
  const navigation = useNavigation();
  const [rankingMode, setRankingMode] = useState(props.rankingMode || 'list'); // 'list' | 'detail'

  const [loading, setLoading] = useState(false);

  const [selectedGender, setSelectedGender] = useState(null);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const weeklyData = useRef();
  const page = useRef();
  const lastPage = useRef();

  // useFocusEffect(
  //   useCallback(() => {
  //     init();
  //     getRankingData();
  //     return () => {
  //       init();
  //       navigation.setParams({ rankingMode: null });
  //     };
  //   }, [props.context?.user?.id]),
  // );
  useEffect(() => {
    init();
    getRankingData();
    return () => {
      init();
    };
  }, [props.context?.user?.id]);
  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setParams({ rankingMode: null });
      };
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      const _params = props.route.params;
      if (weeklyData.current?.length > 0) {
        if (_params?.rankingMode === 'WOMAN') handleSelectedItem(weeklyData.current?.[0], 'WOMAN');
        if (_params?.rankingMode === 'MAN') handleSelectedItem(weeklyData.current?.[0], 'MAN');
      }
    }, [page.current, weeklyData.current, props.route?.params]),
  );

  const init = () => {
    weeklyData.current = [];
    page.current = 1;
    lastPage.current = 1;
    setLoading(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    init();
    getRankingData();
  };

  const getRankingData = async () => {
    setLoading(true);
    try {
      const [response] = await getWeeklyRanking(page.current);

      if (response) {
        let posts = [];
        posts = response.data;
        posts = posts.map((item, index) => {
          item.content = JSON.parse(item.content);
          return item;
        });
        lastPage.current = response?.lastPage;

        if (!(page.current > lastPage.current)) {
          page.current += 1;
          if (weeklyData.current) weeklyData.current = [...weeklyData?.current, ...posts];
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onEndReachedCalledDuringMomentum = useRef();
  const onEndReached = () => {
    if (loading && !(page.current > lastPage.current)) {
      return false;
    } else {
      getRankingData();
    }
  };

  const handleSelectedItem = (item, gender) => {
    setRankingMode('detail');
    setSelected({
      id: item.id,
      date: weekNumberInMonth(item.basis_date),
      content: item.content,
    });
    setSelectedGender(gender);
  };

  return (
    <WhiteSafeArea>
      {rankingMode === 'list' ? (
        <NavHead
          back={false}
          title={'WEEKLY RANKING'}
          onLeftPress={() => {
            props.handleActiveTab('ootd');
          }}
        />
      ) : (
        <NavHead
          onLeftPress={() => {
            navigation.setParams({
              rankingMode: null,
            });
            setRankingMode('list');
          }}
          title={
            selected?.date ? `${selected?.date?.year}년 ${selected?.date?.month}월 ${selected?.date?.weekNo}주차` : `-`
          }
        />
      )}

      {rankingMode === 'list' ? (
        <View style={{ width: '100%', flex: 1 }}>
          <>
            {weeklyData.current?.length < 1 ? (
              <>{loading ? <Spinner /> : <NoData />}</>
            ) : (
              <>
                <FlatList
                  keyExtractor={(item, index) => `${index}_${item.id}`}
                  data={weeklyData.current}
                  disableVirtualization={false}
                  legacyImplementation={true}
                  numColumns={1}
                  refreshing={refreshing}
                  removeClippedSubviews={true} // bug exist
                  renderItem={({ item, index }) => (
                    <SpreadableRanking
                      key={`${item?.id}` || index.toString()}
                      spread={index < 5}
                      selected={selected}
                      handleSelectedItem={handleSelectedItem}
                      item={item}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={18}
                  windowSize={24}
                  ListHeaderComponent={<Spacer height={33} />}
                  ListFooterComponent={
                    <>
                      {page.current <= lastPage.current && <Spinner />}
                      <Spacer size={40} />
                    </>
                  }
                  onMomentumScrollBegin={() => {
                    onEndReachedCalledDuringMomentum.current = false;
                  }}
                  onEndReachedThreshold={0.15}
                  onEndReached={(e) => {
                    onEndReached(e); // LOAD MORE DATA
                  }}
                  onRefresh={handleRefresh}
                />
              </>
            )}
          </>
        </View>
      ) : (
        <WhiteScrollView>
          <RankingDetail
            selectedGender={selectedGender}
            selected={selected}
            setSelectedGender={setSelectedGender}
            setSelected={setSelected}
          />
        </WhiteScrollView>
      )}
    </WhiteSafeArea>
  );
}
RankingPage = withContext(RankingPage);
export default RankingPage;

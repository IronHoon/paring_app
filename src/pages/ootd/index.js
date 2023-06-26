import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RankingPage from './template/Ranking';
import DailyPage from './template/Like';
import BookmarkPage from './template/Bookmark';
import OotdLayout from './component/OotdLayout';
import Ootd from './template/Ootd';
import { BackHandler, View } from 'react-native';
import { withContext } from 'context-q';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import UpperTabs from './component/UpperTabs';
import SearchModal from '../upload/component/SearchModal';
import {
  getBodyList,
  getBottomList,
  getGenderList,
  getHeightList,
  getOuterList,
  getStyleList,
  getTopList,
} from '../../utils/getMetaLists';
import VisualDirectorPage from '../visual-director';
import DailyLookPage from './template/DailyLook';
import { MerchandiseList } from './template/MerchandiseList';

function OotdPage(props) {
  const tabViewRef = React.useRef();
  const category = props.route?.params?.category;
  const navigation = useNavigation();

  const tabArr = ['daily', 'merchandise', 'ranking', 'visualDirector', 'bookmark'];
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    const _activeTab = props.route?.params?.activeTab || 'daily';
    handleActiveTab(tabArr.includes(_activeTab) ? _activeTab : 'daily');
  }, [props.route?.params?.activeTab]);

  const handleActiveTab = (tab) => {
    if (tab !== activeTab && tabArr.indexOf(tab) !== tabViewRef?.current?.state?.currentPage) {
      tabArr.map((v, i) => {
        if (tab === v) {
          navigation.setParams({ activeTab: tab });
          tabViewRef?._component?.goToPage?.(i) || tabViewRef?.current?.goToPage?.(i);
        }
      });
    }
  };

  const onBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
    return true;
  };

  const [filter, setFilter] = useState({});

  useEffect(() => {
    getFilterList();
  }, []);

  const getFilterList = async () => {
    const styles = await getStyleList();
    const outers = await getOuterList();
    const tops = await getTopList();
    const bottoms = await getBottomList();
    const bodyTypes = await getBodyList();
    const genders = await getGenderList();
    const heights = await getHeightList();
    setFilter({
      styles: styles.slice(0, -1),
      outers,
      tops: tops.slice(0, -1),
      bottoms,
      bodyTypes,
      genders,
      heights,
    });
  };

  const [visibleModal, setVisibleModal] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    style: category?.style_id || null,
    gender: null,
    body: null,
    height: null,
    outer: category?.outer_id || null,
    top: category?.top_id || null,
    bottom: category?.bottom_id || null,
  });

  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'search') {
        setVisibleModal(true);
      }
      return () => {
        setVisibleModal(false);
      };
    }, [props.route]),
  );

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <>
      <OotdLayout route={props.route}>
        <ScrollableTabView
          ref={tabViewRef}
          initialPage={0}
          onChangeTab={(e) => {
            setActiveTab(e.ref.props.tabLabel);
            if (e.ref.props.tabLabel === 'search') {
              setVisibleModal(true);
            }
          }}
          renderTabBar={(tabs) => {
            return (
              <UpperTabs
                tabs={tabs}
                activeTabIndex={tabs.activeTab}
                handleActiveTab={handleActiveTab}
              />
            );
          }}>
          <View
            style={{ flex: 1 }}
            tabLabel={'daily'}
            key={'tab_daily'}>
            <DailyLookPage />
          </View>
          <View
            style={{ flex: 1 }}
            tabLabel={'merchandise'}
            key={'tab_merchandise'}>
            <MerchandiseList />
          </View>
          <View
            style={{ flex: 1 }}
            tabLabel={'ranking'}
            key={'tab_ranking'}>
            <RankingPage
              route={props.route}
              handleActiveTab={handleActiveTab}
            />
          </View>
          <View
            style={{ flex: 1 }}
            tabLabel={'visualDirector'}
            key={'tab_visualDirector'}>
            <VisualDirectorPage
              route={props.route}
              handleActiveTab={handleActiveTab}
            />
          </View>
          <View
            style={{ flex: 1 }}
            tabLabel={'bookmark'}
            key={'tab_bookmark'}>
            <BookmarkPage />
          </View>
          {/*<View style={{ flex: 1 }} tabLabel={'search'} key={'tab_search'}>*/}
          {/*  {!visibleModal ? (*/}
          {/*    <SearchPage*/}
          {/*      searching={searching}*/}
          {/*      setSearching={setSearching}*/}
          {/*      searchFilter={searchFilter}*/}
          {/*      setVisibleModal={setVisibleModal}*/}
          {/*    />*/}
          {/*  ) : (*/}
          {/*    <Spinner />*/}
          {/*  )}*/}
          {/*</View>*/}
        </ScrollableTabView>
        {visibleModal && activeTab === 'search' && (
          <SearchModal
            category={category}
            visibleModal={visibleModal}
            handleSearchModal={setVisibleModal}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            setSearching={setSearching}
            filter={filter}
          />
        )}
      </OotdLayout>
    </>
  );
}

OotdPage = withContext(OotdPage);
export default OotdPage;

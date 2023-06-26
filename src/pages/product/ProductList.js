import React, { useCallback, useEffect, useRef, useState } from 'react';

import { LogoHeader, WhiteSafeArea } from '../../components/layouts';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { BackHandler, View } from 'react-native';
import ProductListTabs from './component/ProductListTabs';
import AllProductTab from './template/AllProductTab';
import SearchProductTab from './template/SearchProductTab';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Spinner from '../../atoms/image/Spinner';
import SearchProductModal from './component/SearchProductModal';
import { getBottomList, getOuterList, getStyleList, getTopList } from '../../utils/getMetaLists';

function ProductListPage(props) {
  const navigation = useNavigation();
  const tabViewRef = useRef();
  const tabArr = ['all', 'search'];

  const [searchFilter, setSearchFilter] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    let params = props.route?.params;
    const _activeTab = params?.activeTab || 'all';
    handleActiveTab(tabArr.includes(_activeTab) ? _activeTab : 'all');
  }, [props.route?.params]);

  useFocusEffect(
    useCallback(() => {
      let params = props.route?.params;
      handleActiveTab(activeTab);
      if (activeTab === 'search') {
        if (params?.category1 && params?.category2) {
          setVisibleModal(false);
        } else {
          setVisibleModal(true);
        }
      }

      if (params?.category1 && params?.category2) {
        setSearchFilter({
          category1: params?.category1,
          category2: params?.category2,
        });
      }

      return () => {
        setSearchFilter({});
        setVisibleModal(false);
      };
    }, [props.route?.params, activeTab]),
  );

  const handleActiveTab = (tab) => {
    if (tab !== activeTab || tabArr.indexOf(tab) !== tabViewRef?.current?.state?.currentPage) {
      tabArr.map((v, i) => {
        if (tab === v) {
          tabViewRef?._component?.goToPage?.(i) || tabViewRef?.current?.goToPage?.(i);
        }
      });
    }
  };

  const handleSearchModal = (boolean) => {
    setVisibleModal(boolean);
  };

  const handleSearchFilter = (v) => {
    setSearchFilter(v);
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  const onBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
    return true;
  };

  useEffect(() => {
    getFilterList();
  }, []);
  const [styleList, setStyleList] = useState({});
  const getFilterList = async () => {
    let obj = {};
    obj.style = (await getStyleList()).slice(0, -1);
    obj.outer = await getOuterList();
    obj.top = (await getTopList()).slice(0, -1);
    obj.bottom = await getBottomList();
    setStyleList(obj);
  };

  return (
    <WhiteSafeArea>
      <LogoHeader />
      <ScrollableTabView
        ref={tabViewRef}
        initialPage={0}
        onChangeTab={(e) => {
          setActiveTab(e.ref.props.tabLabel);
          if (e.ref.props.tabLabel === 'search') {
            let params = props.route?.params;
            if (params?.category1 && params?.category2) {
              setVisibleModal(false);
            } else {
              setVisibleModal(true);
            }
          }
        }}
        renderTabBar={(tabs) => {
          return (
            <ProductListTabs
              tabs={tabs}
              activeTabIndex={tabs.activeTab}
              handleActiveTab={handleActiveTab}
            />
          );
        }}>
        <View
          style={{ flex: 1 }}
          tabLabel={'all'}
          key={'tab_all'}>
          <AllProductTab />
        </View>
        <View
          style={{ flex: 1 }}
          tabLabel={'search'}
          key={'tab_search'}>
          {!visibleModal ? (
            <SearchProductTab
              styleList={styleList}
              searchFilter={searchFilter}
              visibleModal={visibleModal}
              setVisibleModal={handleSearchModal}
            />
          ) : (
            <Spinner />
          )}
        </View>
      </ScrollableTabView>

      {visibleModal && activeTab === 'search' && (
        <SearchProductModal
          styleList={styleList}
          searchFilter={searchFilter}
          visibleModal={visibleModal}
          handleSearchFilter={handleSearchFilter}
          handleSearchModal={handleSearchModal}
        />
      )}
    </WhiteSafeArea>
  );
}

export default ProductListPage;

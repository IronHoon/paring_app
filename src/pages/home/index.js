import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, RefreshControl, ScrollView } from 'react-native';
import axios from 'axios';
import { withContext } from 'context-q';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { CART_KEY, TOKEN_KEY } from '@env';
import getDailyRanks from '../../net/ranking/getDailyRanks';
import getRecommends from '../../net/recommends/getRecommends';
import getMetaData from '../../net/meta/getMetaData';
import getPosts from '../../net/post/getPosts';
import getLatestWeeklyRanking from '../../net/ranking/getLastestWeeklyRanking';
import getMyInfo from '../../net/user/getMyInfo';
import getMainOotdImages from '../../net/meta/getMainOotdImages';
import getMainCategoryImages from '../../net/meta/getMainCategoryImages';
import { checkUserPermission } from '../../net/auth/requestUserPermission';

import Spacer from '../../atoms/layout/Spacer';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import LogoHeader from '../../components/layouts/LogoHeader';
import PushPermissionModal from '../../components/modal/PushPermissionModal';
import weekNumberInMonth from '../../utils/WeekNumberInMonth';
import { useFirebase } from '../../utils/useFirebase';
import {
  BannerSection,
  CategorySection,
  DailySection,
  HashOotdSection,
  OotdIndexSection,
  RankingSection,
  TitleArea,
} from './component';
import { Preloader } from '../../components';

const onBackPress = () => {
  BackHandler.exitApp();
  return true;
};

function HomePage(props) {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [bannersData, setBannersData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categories1Data, setCategories1Data] = useState([]);
  const [categories2Data, setCategories2Data] = useState([]);
  const [ootdData, setOotdData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [ootdIndexData, setOotdIndexData] = useState(null);
  const [rankingData, setRankingData] = useState({
    allData: [],
    styleData: [],
    yesterdayData: [],
    femaleWinner: [],
    maleWinner: [],
    genderWinnerDate: {},
  });

  const { getPermissionStatus } = useFirebase();

  useEffect(() => {
    (async function () {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        let cartData = await AsyncStorage.getItem(CART_KEY);
        cartData = JSON.parse(cartData);

        if (token) {
          axios.defaults.headers.common['Authorization'] = 'bearer ' + token;
          const [data] = await getMyInfo();
          const isCommerce = await getIsCommerce();
          props.context.update({
            ...props.context,
            user: data,
            token: token,
            cartData: cartData || [],
            commerce: isCommerce,
          });
          await checkUserPermission((v) => {
            setShowPermissionModal(v);
          });
          await useFirebase().updateToken();
        }
      } catch (error) {
        console.warn(error);
      }
    })();
  }, [props.context?.user?.id]);

  useEffect(() => {
    fetchBannersData();
    fetchOotdData();
    fetchDailyData();
    fetchRankingData();
    fetchCategoriesData();
    fetchCategory1Data();
    fetchCategory2Data();
    fetchOotdIndexData();
  }, [props.context?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      fetchCategoriesData();
      fetchOotdData();
      fetchOotdIndexData();
      fetchDailyData();
      fetchRankingData();
      fetchCategory1Data();
      fetchCategory2Data();
    } catch (error) {
      throw error;
    } finally {
      setRefreshing(false);
    }
  };

  const getIsCommerce = async () => {
    //check is_commerce
    const [commerceResponse] = await getMetaData('is_commerce');
    return commerceResponse.string === 'true';
  };

  const fetchBannersData = async () => {
    try {
      const [data] = await getMetaData('main-banners');
      const parsed = JSON.parse(data?.json);
      setBannersData(parsed);
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchOotdData = async () => {
    try {
      const [data] = await getMainOotdImages();
      setOotdData(data?.json || []);
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchOotdIndexData = async () => {
    try {
      if (!props.context?.user?.id) {
        console.warn('fetchOotdIndexData: user.id is missing');
        return false;
      }
      const [data] = await getPosts(1, '', {
        order: 'rate',
        startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        except_id: props.context.user.id,
        ootd_user_id: props.context.user.id,
      });
      if (data?.data) {
        setOotdIndexData(data.data);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchCategoriesData = async () => {
    try {
      const [data] = await getRecommends();
      setCategories(data);
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchCategory1Data = async () => {
    try {
      const [data] = await getMainCategoryImages('1');
      let res = {
        label: data.json?.label,
        images: data.json?.images?.filter((v, i) => v !== null),
      };
      setCategories1Data(res);
    } catch (error) {
      console.warn('fetchCategory1Data', error);
    }
  };
  const fetchCategory2Data = async () => {
    try {
      const [data] = await getMainCategoryImages('2');
      let res = {
        label: data.json?.label,
        images: data.json?.images?.filter((v, i) => v !== null),
      };
      setCategories2Data(res);
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchDailyData = async () => {
    try {
      const [data] = await getPosts(1, 'daily', {
        order: 'likes',
        startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      });
      setDailyData(data?.data || []);
    } catch (error) {
      console.warn(error);
    }
  };
  const fetchRankingData = async () => {
    try {
      let result = {};
      const [dailyRanksResponse] = await getDailyRanks(1);

      if (dailyRanksResponse?.data) {
        result.allData = dailyRanksResponse.data[0].content
          ? JSON.parse(dailyRanksResponse.data[0].content)?.items
          : [];
        result.styleData = JSON.parse(dailyRanksResponse.data[0].content);
        result.yesterdayData = dailyRanksResponse.data?.[1]
          ? JSON.parse(dailyRanksResponse.data[1].content)?.items
          : [];

        result.basisDate = dailyRanksResponse.data[0].created_at;
      }

      const [weeklyRankingResponse] = await getLatestWeeklyRanking();

      if (weeklyRankingResponse) {
        const date = weekNumberInMonth(weeklyRankingResponse.basis_date);
        result.genderWinnerDate = date;

        const content = JSON.parse(weeklyRankingResponse.content);
        result.femaleWinner = content?.women?.[0] || [];
        result.maleWinner = content?.men?.[0] || [];
        setRankingData({ ...rankingData, ...result });
      }

      setRankingData({ ...rankingData, ...result });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <WhiteSafeArea>
      <LogoHeader search={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <BannerSection banners={bannersData} />
        <Spacer height={20} />
        <HashOotdSection posts={ootdData} />
        <Spacer height={28} />
        <OotdIndexSection posts={ootdIndexData} />
        <Spacer height={28} />
        <TitleArea
          title={'TODAY RANK'}
          buttonTitle={'업로드'}
          destination={'Upload'}
        />
        <RankingSection {...rankingData} />
        {categories && categories1Data?.images?.length > 0 && (
          <>
            <Spacer height={28} />
            <TitleArea
              title={'# ' + categories1Data.label}
              buttonTitle={'더보기'}
              destination={'Ootd'}
            />
            <Spacer height={11} />
            <CategorySection
              to={'mainCategory1'}
              posts={categories1Data.images}
            />
          </>
        )}
        {dailyData?.length > 0 && (
          <>
            <Spacer height={30} />
            <TitleArea
              title={'Like 인기패션'}
              buttonTitle={'업로드'}
              destination={'Upload'}
            />
            <Spacer height={11} />
            <DailySection posts={dailyData} />
          </>
        )}
        {categories2Data?.images && (
          <>
            <Spacer height={30} />
            <TitleArea
              title={'# ' + categories2Data.label}
              buttonTitle={'더보기'}
              destination={'Ootd'}
            />
            <Spacer height={11} />
            <CategorySection
              to={'mainCategory2'}
              posts={categories2Data.images}
            />
          </>
        )}
        <Spacer height={16} />
      </ScrollView>
      {showPermissionModal && (
        <PushPermissionModal
          visible={showPermissionModal}
          setVisible={setShowPermissionModal}
        />
      )}
      <Preloader />
    </WhiteSafeArea>
  );
}

HomePage = withContext(HomePage);
export default HomePage;

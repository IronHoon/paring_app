import React, { useCallback, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import getOthersInfo from '../../net/user/getOthersInfo';
import getOthersPosts from '../../net/user/getOthersPosts';
import { Spacer } from '../../atoms/layout';
import GridLayout from '../../atoms/layout/GridLayout';
import styled from 'styled-components/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Spinner } from '../../atoms/image';
import { NavHead, WhiteScrollView } from '../../components/layouts';
import { withContext } from 'context-q';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { Text } from '../../atoms/text';
import { OthersProfileHeader } from './component/OthersProfileHeader';

const NoDataArea = styled.View`
  flex: 1;
  align-items: center;
  padding-vertical: 100px;
  background-color: #eff0f2;
`;

function OthersProfilePage(props) {
  const params = props.route?.params;
  const userId = params.userId;

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const postsData = useRef();
  const page = useRef();
  const lastPage = useRef();

  useFocusEffect(
    useCallback(() => {
      init();
      getOthersInfoData();
      getPostsData();
      return () => {
        init();
      };
    }, [props.route?.params, userId]),
  );

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    init();
    getOthersInfoData();
    getPostsData();
  };

  const init = () => {
    setLoading(true);
    postsData.current = [];
    page.current = 1;
    lastPage.current = 1;
    setUserData([]);
  };

  const getOthersInfoData = () => {
    const fetchData = async () => {
      try {
        const [data] = await getOthersInfo(userId);

        setUserData(data);
      } catch (error) {
        console.warn(error);
      }
    };

    fetchData();
  };

  const getPostsData = async () => {
    setLoading(true);
    try {
      const [data] = await getOthersPosts(userId, page.current);
      const post = data?.data;
      lastPage.current = data?.lastPage;

      if (!(page.current > lastPage.current)) {
        page.current += 1;
        postsData.current = [...postsData.current, ...post];
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'othersProfile',
        otherUserId: userData?.id,
      },
    });
  }
  const onEndReached = () => {
    if (loading && !(page.current > lastPage.current)) {
      return false;
    } else {
      getPostsData();
    }
  };

  return (
    <WhiteSafeArea>
      <NavHead />
      {postsData.current?.length > 0 ? (
        <>
          <GridLayout
            useFlatlist
            handlePressItem={handlePressItem}
            dataset={postsData.current}
            onEndReached={onEndReached}
            ListFooterComponent={page.current <= lastPage.current && <Spinner />}
            refreshing={refreshing}
            handleRefresh={handleRefresh}
            ListHeaderComponent={
              <>
                <OthersProfileHeader
                  userId={userId}
                  userData={userData}
                  activeTab={'daily'}
                />
              </>
            }
          />
        </>
      ) : (
        <>
          {!loading ? (
            <WhiteScrollView style={{ flex: 1, backgroundColor: '#eff0f2' }}>
              <View style={{ backgroundColor: '#fff' }}>
                <OthersProfileHeader
                  params={params}
                  userData={userData}
                  activeTab={'daily'}
                />
              </View>
              <NoDataArea>
                <Image
                  style={{ width: 61, height: 61 }}
                  source={require('../../../assets/mypage_empty.png')}
                />
                <Spacer size={20} />
                <Text
                  bold
                  align='center'
                  size={16}>
                  아직 업로드된 스타일이 없어요.
                </Text>
              </NoDataArea>
            </WhiteScrollView>
          ) : (
            <Spinner />
          )}
        </>
      )}
    </WhiteSafeArea>
  );
}
export default withContext(OthersProfilePage);

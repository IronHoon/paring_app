import React, { useCallback, useRef, useState } from 'react';
import { BackHandler, Text } from 'react-native';

import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import { NavHead } from '../../../components/layouts';
import { GraySpace, Spacer } from '../../../atoms/layout';
import GridLayout from '../../../atoms/layout/GridLayout';
import { Icon, Spinner } from '../../../atoms/image';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import getMyRatingDetail from '../../../net/user/getMyRatingDetail';
import NoData from '../../../atoms/carousel/NoData';

function MyVoteDetailPage(props) {
  const {
    params: { score },
  } = props.route?.params;

  const [loading, setLoading] = useState(false);

  const postsData = useRef();
  const page = useRef();
  const lastPage = useRef();
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      init();
      getPostsData();
      return () => {
        init();
      };
    }, []),
  );

  const init = () => {
    setLoading(true);
    postsData.current = [];
    page.current = 1;
    lastPage.current = 1;
  };

  const getPostsData = async () => {
    setLoading(true);
    try {
      const [data] = await getMyRatingDetail(page.current, score);

      let post = data?.data;
      post = post.map((v, i) => v.post);
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
  const handleRefresh = () => {
    setRefreshing(true);
    init();
    getPostsData();
  };
  const onEndReached = () => {
    if (loading && !(page.current > lastPage.current)) {
      return false;
    } else {
      getPostsData();
    }
  };

  const handlePressItem = (post) => {
    navigation.navigate('SinglePostDetail', {
      screen: 'SinglePostDetail',
      params: {
        feedId: post?.id,
        from: 'myVote',
      },
    });
  };
  const onBackPress = (post) => {
    navigation.navigate('VisualDirector', {
      screen: 'VisualDirector',
      params: { back: false },
    });
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  return (
    <WhiteSafeArea>
      <NavHead textAlignLeft>
        <Icon
          size={22}
          source={require('../../../../assets/bigFullStar_fit.png')}
        />
        <Spacer width={10} />
        <Text
          size={17}
          style={{ marginTop: 2 }}>
          {score}점 준 패션
        </Text>
      </NavHead>
      <GraySpace />

      {(!postsData.current || postsData.current?.length === 0) && loading && <Spinner />}
      {postsData.current?.length > 0 ? (
        <>
          <GridLayout
            handlePressItem={handlePressItem}
            dataset={postsData.current}
            onEndReached={onEndReached}
            ListFooterComponent={loading && <Spinner />}
            refreshing={refreshing}
            handleRefresh={handleRefresh}
          />
        </>
      ) : (
        <>{!loading && <NoData />}</>
      )}
    </WhiteSafeArea>
  );
}

export default MyVoteDetailPage;
